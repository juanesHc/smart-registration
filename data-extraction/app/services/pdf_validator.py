from fastapi import UploadFile

from app.config import settings
from app.exceptions.extraction_exceptions import PdfValidationException
from app.schemas.messages import MessageCodes


def validate_pdf(file: UploadFile) -> None:
    if file is None or file.filename is None:
        raise PdfValidationException(MessageCodes.PDF_FILE_REQUIRED, "No file received")

    if not file.filename.lower().endswith(".pdf"):
        raise PdfValidationException(
            MessageCodes.PDF_FILE_INVALID_TYPE,
            f"Filename must end with .pdf (got: {file.filename})",
        )

    if file.content_type != "application/pdf":
        raise PdfValidationException(
            MessageCodes.PDF_FILE_INVALID_TYPE,
            f"Content-Type must be application/pdf (got: {file.content_type})",
        )

    max_bytes = settings.pdf_max_size_bytes
    if file.size is not None and file.size > max_bytes:
        raise PdfValidationException(
            MessageCodes.PDF_FILE_TOO_LARGE,
            f"File exceeds {settings.PDF_MAX_SIZE_MB}MB (got: {file.size} bytes)",
        )
