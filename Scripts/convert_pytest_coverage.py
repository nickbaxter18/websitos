#!/usr/bin/env python3
import sys, json

if len(sys.argv) < 3:
    print("Usage: python convert-pytest-coverage.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

with open(input_file, "r") as f:
    raw = json.load(f)

summary = {
    "workflow": "coverage-checks",
    "job": "pytest-coverage",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

threshold = 85.0  # adjust global coverage threshold

total = raw.get("totals", {}).get("percent_covered", 0.0)
if total < threshold:
    summary["errors"].append({
        "file": "ALL",
        "line": None,
        "message": f"Global coverage {total}% below threshold {threshold}%",
        "rule": "coverage-threshold",
        "severity": "error",
        "suggestion": "Add missing tests to reach coverage requirements."
    })
    summary["status"] = "failure"

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Pytest coverage summary written to {output_file}")