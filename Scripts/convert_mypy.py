#!/usr/bin/env python3
import sys, json, re

if len(sys.argv) < 3:
    print("Usage: python convert-mypy.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

with open(input_file, "r") as f:
    lines = f.readlines()

summary = {
    "workflow": "backend-checks",
    "job": "mypy",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

pattern = re.compile(r"^(.*):(\d+):(\d+): (error|note): (.*)$")

for line in lines:
    match = pattern.match(line.strip())
    if match:
        file, line_no, col, severity, message = match.groups()
        entry = {
            "file": file,
            "line": int(line_no),
            "column": int(col),
            "message": message,
            "rule": "mypy",
            "severity": "error" if severity == "error" else "warning",
            "suggestion": None
        }
        if severity == "error":
            summary["errors"].append(entry)
            summary["status"] = "failure"
        else:
            summary["warnings"].append(entry)

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Mypy summary written to {output_file}")