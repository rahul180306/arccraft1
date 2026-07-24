from app.core.config import settings

class LLMGlobalConfig:
    """LLM module configuration accessor."""
    default_provider = settings.DEFAULT_PROVIDER
    default_reasoning_model = settings.DEFAULT_REASONING_MODEL
    default_embedding_model = settings.DEFAULT_EMBEDDING_MODEL
    fallback_provider = settings.FALLBACK_PROVIDER
    fallback_model = settings.FALLBACK_MODEL
