import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

db_url = "postgresql+asyncpg://neondb_owner:npg_5jK9qfSdLwMJ@ep-round-leaf-azezla9j-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
async def test():
    print("Testing DB connection...")
    try:
        engine = create_async_engine(db_url)
        async with engine.connect() as conn:
            res = await conn.execute(text("SELECT 1"))
            print("DB SUCCESS:", res.scalar())
    except Exception as e:
        print("DB ERROR:", e)

asyncio.run(test())
