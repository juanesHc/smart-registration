import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.core.exception_handlers import (
    claude_api_exception_handler,
    generic_exception_handler,
    pdf_validation_exception_handler,
)
from app.exceptions.extraction_exceptions import (
    ClaudeApiException,
    PdfValidationException,
)
from app.routers import extraction

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


app = FastAPI(
    title="Data Extraction Service",
    description="Microservicio que extrae datos personales de PDFs (CVs) usando Claude API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_exception_handler(PdfValidationException, pdf_validation_exception_handler)
app.add_exception_handler(ClaudeApiException, claude_api_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


app.include_router(extraction.router)


@app.get("/health", tags=["health"])
def health_check():
    return {
        "status": "ok",
        "service": "data-extraction",
        "model": settings.ANTHROPIC_MODEL,
    }


@app.get("/", tags=["health"])
def root():
    return {"message": "Data Extraction Service is running"}
