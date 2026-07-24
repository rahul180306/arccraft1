# ArcCraft Model Architecture Specification

## Overview
ArcCraft features a provider-independent AI Layer built on top of a Model Gateway pattern. AI Agents (Supervisor, Planner, Investigator, etc.) do not interact directly with model SDKs or vendors; all calls are routed through the `ModelGateway`.

```
User -> Supervisor -> Planner -> [ModelGateway] -> LLM Provider -> Response
```

## Key Layers
1. **`app/llm/types.py`**: Strong Pydantic types, enums (`ProviderType`, `ModelCapability`), and request/response models.
2. **`app/llm/provider.py`**: Abstract `BaseProvider` contract enforcing interface compliance across vendor providers.
3. **`app/llm/nvidia/`**: NVIDIA provider implementation supporting GLM-5.2 and Nemotron-3-Embed-1B.
4. **`app/llm/gemini/`**: Gemini provider implementation supporting Gemini 3.1 Pro Preview, 3.6 Flash, 3.5 Live Translate, and 3.1 Flash Lite Image.
5. **`app/llm/registry.py`**: Provider registry decoupled from business logic.
6. **`app/llm/gateway.py`**: Gateway providing single public facade, capability routing, and failover infrastructure.
