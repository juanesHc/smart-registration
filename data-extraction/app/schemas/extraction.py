from pydantic import BaseModel


class ExtractedData(BaseModel):
    firstName: str | None = None
    lastName: str | None = None
    email: str | None = None
    phone: str | None = None
    documentType: str | None = None
    numberId: str | None = None
    address: str | None = None
    city: str | None = None
    country: str | None = None
    extraData: str | None = None


class ExtractionMetadata(BaseModel):
    model: str
    processingTimeMs: int


class ExtractionResponse(BaseModel):
    data: ExtractedData
    extractedFields: list[str]
    missingFields: list[str]
    metadata: ExtractionMetadata


class ErrorResponse(BaseModel):
    messageCode: str
    detail: str | None = None
