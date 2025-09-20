#!/usr/bin/env python3
import sys, json, re

if len(sys.argv) < 3:
    print("Usage: python convert-flake8.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

with open(input_file, "r") as f:
    lines = f.readlines()

summary = {
    "workflow": "backend-checks",
    "job": "flake8",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

pattern = re.compile(r"^(.*?):(\d+):(\d+): ([A-Z]\d+) (.*)$")

for line in lines:
    match = pattern.match(line.strip())
    if match:
        file, line_no, col, code, message = match.groups()
        entry = {
            "file": file,
            "line": int(line_no),
            "column": int(col),
            "message": message,
            "rule": code,
            "severity": "error" if code.startswith("E") else "warning",
            "suggestion": None
        }
        if code.startswith("E"):
            summary["errors"].append(entry)
            summary["status"] = "failure"
        else:
            summary["warnings"].append(entry)

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Flake8 summary written to {output_file}")