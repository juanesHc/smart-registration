import base64
import json
import logging
import time

from anthropic import Anthropic, APIError, RateLimitError

from app.config import settings
from app.exceptions.extraction_exceptions import ClaudeApiException
from app.schemas.extraction import (
    ExtractedData,
    ExtractionMetadata,
    ExtractionResponse,
)
from app.schemas.messages import MessageCodes

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """Eres un asistente experto en extraer datos personales de hojas de vida (CVs).

Analiza el documento PDF adjunto y extrae los siguientes campos en formato JSON:

- firstName: Solo el primer nombre o nombres compuestos (sin apellidos). Ejemplo: "Juan Carlos".
- lastName: Solo los apellidos. Ejemplo: "Pérez Gómez".
- email: Email completo. Debe contener "@". Si hay varios, devuelve el principal.
- phone: Teléfono celular colombiano. Debe ser exactamente 10 dígitos empezando con 3. Limpia espacios, guiones, paréntesis y prefijos como "+57". Si no cumple ese formato, devuelve null.
- documentType: Tipo de documento. Solo puede ser uno de: "CC" (Cédula de Ciudadanía), "TI" (Tarjeta de Identidad), "CE" (Cédula de Extranjería), "PASSPORT" (Pasaporte). Si no estás seguro, devuelve null.
- numberId: Número del documento. Solo dígitos, entre 6 y 15 caracteres. Limpia puntos, espacios o guiones.
- address: Dirección de residencia completa tal como aparece. Ejemplo: "Calle 50 #20-30, Medellín, Antioquia, Colombia".
- city: Ciudad de residencia.
- country: País de residencia. Si no aparece pero hay indicios (teléfono colombiano, ciudades colombianas), asume "Colombia".
- extraData: Resumen breve (máximo 500 caracteres) de la experiencia profesional, educación o habilidades destacadas. Útil como contexto adicional sobre la persona.

REGLAS CRÍTICAS:
1. NO inventes datos. Si un campo no aparece en el PDF o no estás seguro, devuelve null para ese campo.
2. Devuelve EXCLUSIVAMENTE el objeto JSON, sin texto adicional, sin markdown, sin explicaciones.
3. Todos los campos deben estar presentes en el JSON (con valor o null).
4. Limpia los datos al extraer (sin espacios extra, formato consistente)."""


class ClaudeService:
    def __init__(self) -> None:
        self.client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.model = settings.ANTHROPIC_MODEL

    async def extract_from_pdf(self, pdf_bytes: bytes) -> ExtractionResponse:
        start = time.time()

        try:
            pdf_base64 = base64.standard_b64encode(pdf_bytes).decode("utf-8")

            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "document",
                                "source": {
                                    "type": "base64",
                                    "media_type": "application/pdf",
                                    "data": pdf_base64,
                                },
                            },
                            {
                                "type": "text",
                                "text": "Extrae los datos personales del CV adjunto. Devuelve solo el JSON, sin texto adicional.",
                            },
                        ],
                    }
                ],
            )

            text_response = response.content[0].text.strip()

            if text_response.startswith("```"):
                text_response = text_response.split("```")[1]
                if text_response.startswith("json"):
                    text_response = text_response[4:]
                text_response = text_response.strip()

            extracted_dict = json.loads(text_response)
            extracted_data = ExtractedData(**extracted_dict)

            elapsed_ms = int((time.time() - start) * 1000)

            dumped = extracted_data.model_dump()
            extracted_fields = [k for k, v in dumped.items() if v is not None]
            missing_fields = [k for k, v in dumped.items() if v is None]

            logger.info(
                "Extraction OK in %dms — %d fields found, %d missing",
                elapsed_ms,
                len(extracted_fields),
                len(missing_fields),
            )

            return ExtractionResponse(
                data=extracted_data,
                extractedFields=extracted_fields,
                missingFields=missing_fields,
                metadata=ExtractionMetadata(
                    model=self.model,
                    processingTimeMs=elapsed_ms,
                ),
            )

        except RateLimitError as e:
            logger.warning("Claude rate limited: %s", e)
            raise ClaudeApiException(MessageCodes.CLAUDE_RATE_LIMITED, str(e))

        except APIError as e:
            logger.error("Claude API error: %s", e)
            raise ClaudeApiException(MessageCodes.CLAUDE_API_ERROR, str(e))

        except json.JSONDecodeError as e:
            logger.error("Claude returned invalid JSON: %s", e)
            raise ClaudeApiException(
                MessageCodes.EXTRACTION_FAILED, f"Claude returned invalid JSON: {e}"
            )

        except ClaudeApiException:
            raise

        except Exception as e:
            logger.exception("Unexpected extraction error")
            raise ClaudeApiException(MessageCodes.EXTRACTION_FAILED, str(e))
