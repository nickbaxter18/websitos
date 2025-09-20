#!/usr/bin/env python3
import json, sys

if len(sys.argv) < 3:
    print("Usage: python convert_pytest.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

with open(input_file, "r") as f:
    raw = json.load(f)

summary = {
    "workflow": "backend-checks",
    "job": "pytest",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

for test in raw.get("tests", []):
    outcome = test.get("outcome")
    message = test.get("call", {}).get("crash", {}).get("message", test.get("longrepr", outcome))
    stack = test.get("call", {}).get("crash", {}).get("traceback", [])
    details = "\n".join(stack[:5]) if stack else None

    entry = {
        "file": test.get("file", "unknown"),
        "line": test.get("line", 0),
        "message": message,
        "rule": test.get("nodeid", "pytest"),
        "severity": "error" if outcome == "failed" else "notice",
        "suggestion": None,
        "details": details
    }
    if outcome == "failed":
        summary["errors"].append(entry)
        summary["status"] = "failure"
    elif outcome == "skipped":
        summary["notices"].append(entry)

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Pytest summary written to {output_file}")