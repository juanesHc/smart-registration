import logging

from fastapi import APIRouter, File, UploadFile, status

from app.schemas.extraction import ExtractionResponse
from app.services.claude_service import ClaudeService
from app.services.pdf_validator import validate_pdf

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["extraction"])

claude_service = ClaudeService()


@router.post(
    "/extract",
    response_model=ExtractionResponse,
    status_code=status.HTTP_200_OK,
    summary="Extrae datos personales de un PDF (CV)",
    description=(
        "Recibe un archivo PDF y devuelve los datos personales extraídos por Claude API. "
        "Los campos no encontrados vienen como null."
    ),
)
async def extract_data(file: UploadFile = File(...)) -> ExtractionResponse:
    logger.info("Extract request received: filename=%s size=%s", file.filename, file.size)
    validate_pdf(file)
    pdf_bytes = await file.read()
    return await claude_service.extract_from_pdf(pdf_bytes)
