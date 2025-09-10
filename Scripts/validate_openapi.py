import requests
import sys

url = "http://localhost:8000/api/openapi.json"

try:
    resp = requests.get(url, timeout=10)
    resp.raise_for_status()
    spec = resp.json()
    print("✅ Successfully fetched OpenAPI spec")
except Exception as e:
    print("❌ Failed to fetch OpenAPI spec:", e)
    sys.exit(1)

# Basic structural validation
required_keys = ["openapi", "info", "paths"]
missing = [k for k in required_keys if k not in spec]
if missing:
    print(f"❌ Invalid OpenAPI spec: missing keys {missing}")
    sys.exit(1)

print("🎉 OpenAPI spec looks valid")