import logging

from fastapi import Request, status
from fastapi.responses import JSONResponse

from app.exceptions.extraction_exceptions import (
    ClaudeApiException,
    PdfValidationException,
)
from app.schemas.messages import MessageCodes

logger = logging.getLogger(__name__)


async def pdf_validation_exception_handler(request: Request, exc: PdfValidationException):
    logger.warning("PDF validation failed: %s — %s", exc.message_code, exc.detail)
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"messageCode": exc.message_code, "detail": exc.detail},
    )


async def claude_api_exception_handler(request: Request, exc: ClaudeApiException):
    code = exc.message_code
    if code == MessageCodes.CLAUDE_RATE_LIMITED:
        http_status = status.HTTP_429_TOO_MANY_REQUESTS
    else:
        http_status = status.HTTP_502_BAD_GATEWAY
    logger.error("Claude API exception: %s — %s", code, exc.detail)
    return JSONResponse(
        status_code=http_status,
        content={"messageCode": code, "detail": exc.detail},
    )


async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"messageCode": MessageCodes.INTERNAL_ERROR, "detail": str(exc)},
    )
