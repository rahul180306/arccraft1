import sys, os
sys.path.insert(0, os.path.abspath('backend'))
from fastapi.testclient import TestClient
from main import app
client = TestClient(app)
resp = client.post("/api/v1/chat", json={})
print(f"Status: {resp.status_code}, Response: {resp.json()}")
