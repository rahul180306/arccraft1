import os
import sys
import asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath('backend'))

load_dotenv(dotenv_path="backend/.env")

async def main():
    print("=== PART 1: ENVIRONMENT VERIFICATION ===")
    from app.core.config import settings
    
    required = ["DATABASE_URL", "NVIDIA_API_KEY", "GEMINI_API_KEY", "DEFAULT_PROVIDER", "DEFAULT_REASONING_MODEL", "DEFAULT_EMBEDDING_MODEL", "FALLBACK_PROVIDER", "FALLBACK_MODEL", "JWT_SECRET"]
    for req in required:
        val = getattr(settings, req, "MISSING")
        if val is None:
            val = "None"
        elif not isinstance(val, str):
            val = str(val)
        masked = val[:4] + "***" + val[-4:] if len(val) > 8 else "***"
        print(f"{req}: {masked}")

    print("\n=== PART 2: NEON DATABASE VERIFICATION ===")
    db_url = settings.DATABASE_URL
    if db_url and db_url.startswith("postgresql://"):
        db_url_async = db_url.replace("postgresql://", "postgresql+asyncpg://").replace("sslmode=require", "ssl=require").replace("&channel_binding=require", "")
    else:
        db_url_async = db_url

    try:
        engine = create_async_engine(db_url_async)
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1"))
            print(f"SELECT 1 Result: {res.scalar()}")
        await engine.dispose()
        print("Neon Database connection pool successfully initialized and gracefully closed.")
    except Exception as e:
        print("Database Verification Failed:", e)

    print("\n=== PART 3, 4 & 8: FASTAPI & ENDPOINT VERIFICATION ===")
    try:
        from fastapi.testclient import TestClient
        from main import app

        client = TestClient(app)

        endpoints = [
            ("GET", "/api/v1/health"),
            ("POST", "/api/v1/chat"),
            ("POST", "/api/v1/investigate"),
            ("POST", "/api/v1/search"),
            ("POST", "/api/v1/timeline"),
            ("POST", "/api/v1/report"),
            ("POST", "/api/v1/graph"),
            ("POST", "/api/v1/bias")
        ]
        
        for method, url in endpoints:
            if method == "GET":
                resp = client.get(url)
            else:
                resp = client.post(url, json={"message": "test"} if url == "/api/v1/chat" else {})
            print(f"{method} {url} -> {resp.status_code}")
            if resp.status_code == 200:
                print(f"   Response: {resp.json()}")

        print("\nTriggering Controlled Validation Error (Part 8):")
        resp = client.post("/api/v1/chat", json={})
        print(f"Controlled Error Test -> {resp.status_code} {resp.json()}")

    except Exception as e:
        print("FastAPI / Endpoints Verification Failed:", type(e).__name__, e)

    print("\n=== PART 5, 6, 7 & 10: ARCHITECTURE & LLM GATEWAY VERIFICATION ===")
    try:
        import app.graph.state
        import app.graph.workflow
        import app.graph.nodes
        import app.graph.edges
        import app.database.base
        import app.core.logging
        import app.telemetry.metrics
        import app.telemetry.tracing
        from app.llm.registry import ModelRegistry
        from app.llm.gateway import ModelGateway
        from app.llm.nvidia.provider import NvidiaProvider
        from app.llm.gemini.provider import GeminiProvider

        registry = ModelRegistry()
        registry.register_provider(NvidiaProvider())
        registry.register_provider(GeminiProvider())
        
        gateway = ModelGateway(registry)
        await gateway.initialize()
        
        health_info = await gateway.health()
        print("Model Gateway Health:", health_info)
        print("Loaded Models:", [m.name for m in gateway.list_models()])
        print("Modules imported successfully. No circular imports.")
    except Exception as e:
        print("Architecture Import Verification Failed:", e)
        
    print("\n=== PART 9: DEPENDENCIES ===")
    import fastapi
    import sqlalchemy
    import pydantic
    try:
        import langgraph
        lg_ver = langgraph.__version__
    except:
        lg_ver = "installed (version hidden or not directly accessible)"
        
    print(f"FastAPI: {fastapi.__version__}")
    print(f"SQLAlchemy: {sqlalchemy.__version__}")
    print(f"Pydantic: {pydantic.__version__}")
    print(f"LangGraph: {lg_ver}")

if __name__ == "__main__":
    asyncio.run(main())
