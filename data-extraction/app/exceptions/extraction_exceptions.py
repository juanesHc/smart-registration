class ExtractionException(Exception):
    def __init__(self, message_code: str, detail: str | None = None):
        self.message_code = message_code
        self.detail = detail
        super().__init__(detail or message_code)


class PdfValidationException(ExtractionException):
    pass


class ClaudeApiException(ExtractionException):
    pass
