import unittest
import asyncio
import os
import sys

sys.path.insert(0, os.path.abspath('backend'))

from app.llm.registry import ModelRegistry
from app.llm.gateway import ModelGateway
from app.llm.nvidia.provider import NvidiaProvider
from app.llm.gemini.provider import GeminiProvider
from app.llm.types import ProviderType, ModelCapability, GenerationRequest, EmbeddingRequest
from app.core.config import settings

class TestLLMGateway(unittest.TestCase):

    def setUp(self):
        self.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self.loop)

    def tearDown(self):
        self.loop.close()

    def test_provider_registration(self):
        registry = ModelRegistry()
        nvidia = NvidiaProvider()
        gemini = GeminiProvider()
        
        registry.register_provider(nvidia)
        registry.register_provider(gemini)
        
        registered = registry.list_providers()
        self.assertIn(ProviderType.NVIDIA, registered)
        self.assertIn(ProviderType.GEMINI, registered)
        self.assertEqual(len(registered), 2)

    def test_gateway_initialization(self):
        async def _run():
            registry = ModelRegistry()
            registry.register_provider(NvidiaProvider())
            registry.register_provider(GeminiProvider())
            
            gateway = ModelGateway(registry)
            await gateway.initialize()
            
            health = await gateway.health()
            self.assertEqual(health["gateway"], "ready")
            self.assertEqual(health["default_provider"], "nvidia")
            self.assertEqual(health["fallback_provider"], "gemini")
            self.assertEqual(health["loaded_models_count"], 6)

        self.loop.run_until_complete(_run())

    def test_configuration_loading(self):
        self.assertEqual(settings.DEFAULT_PROVIDER, "nvidia")
        self.assertEqual(settings.FALLBACK_PROVIDER, "gemini")
        self.assertEqual(settings.DEFAULT_REASONING_MODEL, "nvidia/glm-5.2")
        self.assertEqual(settings.DEFAULT_EMBEDDING_MODEL, "nvidia/nemotron-3-embed-1b")
        self.assertTrue(settings.ENABLE_PROVIDER_FALLBACK)

    def test_provider_selection_and_generation(self):
        async def _run():
            registry = ModelRegistry()
            registry.register_provider(NvidiaProvider())
            registry.register_provider(GeminiProvider())
            
            gateway = ModelGateway(registry)
            await gateway.initialize()
            
            req = GenerationRequest(prompt="Hello ArcCraft AI OS", provider=ProviderType.NVIDIA)
            res = await gateway.generate(req)
            self.assertEqual(res.provider_used, ProviderType.NVIDIA)
            self.assertIn("NVIDIA", res.text)

            req_gemini = GenerationRequest(prompt="Hello Gemini", provider=ProviderType.GEMINI)
            res_gemini = await gateway.generate(req_gemini)
            self.assertEqual(res_gemini.provider_used, ProviderType.GEMINI)
            self.assertIn("Gemini", res_gemini.text)

        self.loop.run_until_complete(_run())

    def test_health_status(self):
        async def _run():
            registry = ModelRegistry()
            registry.register_provider(NvidiaProvider())
            registry.register_provider(GeminiProvider())
            gateway = ModelGateway(registry)
            await gateway.initialize()
            
            health = await gateway.health()
            self.assertIn("providers", health)
            self.assertIn("nvidia", health["providers"])
            self.assertIn("gemini", health["providers"])

        self.loop.run_until_complete(_run())

if __name__ == "__main__":
    unittest.main()
