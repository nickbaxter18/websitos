#!/usr/bin/env python3
import sys, json

if len(sys.argv) < 3:
    print("Usage: python convert-black.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

with open(input_file, "r") as f:
    lines = f.readlines()

summary = {
    "workflow": "backend-checks",
    "job": "black",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

for line in lines:
    line = line.strip()
    if not line:
        continue
    if "reformatted" in line or "would reformat" in line:
        file = line.split()[0]
        summary["warnings"].append({
            "file": file,
            "line": None,
            "column": None,
            "message": "File not formatted according to Black",
            "rule": "black",
            "severity": "warning",  # always warning, not error
            "suggestion": f"Run `black {file}`"
        })
        summary["status"] = "failure"

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Black summary written to {output_file}")