# Model Gateway Guide

## Overview
`ModelGateway` is the exclusive public interface for AI operations in ArcCraft.

## Public Interface Methods
- `generate(request: GenerationRequest) -> GenerationResponse`
- `stream(request: GenerationRequest) -> AsyncGenerator[str, None]`
- `embed(request: EmbeddingRequest) -> EmbeddingResponse`
- `health() -> Dict[str, Any]`
- `list_models() -> List[ModelMetadata]`

## Failover Strategy
- Primary Provider: NVIDIA (`nvidia/glm-5.2`)
- Fallback Provider: Gemini (`gemini-3.1-pro-preview`)
- If primary provider fails or is unreachable, gateway transparently reroutes requests to the fallback provider without breaking agent execution.
