from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ANTHROPIC_API_KEY: str
    ANTHROPIC_MODEL: str = "claude-haiku-4-5-20251001"
    APP_PORT: int = 8000
    PDF_MAX_SIZE_MB: int = 10
    LOG_LEVEL: str = "INFO"

    @property
    def pdf_max_size_bytes(self) -> int:
        return self.PDF_MAX_SIZE_MB * 1024 * 1024


settings = Settings()
