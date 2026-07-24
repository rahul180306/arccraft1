# Model Selection & Capability Routing Policy

## Intelligent Model Routing Policy
Agents request model capabilities rather than hardcoding vendor names. The `ModelGateway` routes requests as follows:

| Task Capability | Primary Selection | Fallback Selection |
| :--- | :--- | :--- |
| **Reasoning Tasks** | `nvidia/glm-5.2` (NVIDIA) | `gemini-3.1-pro-preview` (Gemini) |
| **Fast Planning Tasks** | `gemini-3.6-flash` (Gemini) | `nvidia/glm-5.2` (NVIDIA) |
| **Embeddings Tasks** | `nvidia/nemotron-3-embed-1b` (NVIDIA) | `gemini-3.6-flash` (Gemini) |
| **Image Understanding** | `gemini-3.1-flash-lite-image` (Gemini) | N/A |
| **Live Translation** | `gemini-3.5-live-translate-preview` (Gemini) | N/A |
