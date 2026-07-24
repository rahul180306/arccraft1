# Provider Integration Guide

## Adding a New LLM Provider
To add a new provider (e.g. OpenAI, Anthropic, DeepSeek) to ArcCraft:

1. Create directory `app/llm/<provider_name>/`
2. Implement `models.py` defining registered models and capabilities using `ModelMetadata`.
3. Implement `config.py` extending Pydantic settings.
4. Implement `client.py` wrapping vendor SDK or HTTP transport.
5. Implement `provider.py` inheriting from `BaseProvider` and implementing abstract methods:
   - `initialize()`
   - `health()`
   - `generate()`
   - `stream()`
   - `embed()`
   - `shutdown()`
   - `list_models()`
   - `supports_images()`
   - `supports_audio()`
   - `supports_streaming()`
6. Register the provider in `app/api/dependencies/llm.py` using `registry.register_provider(...)`.
