#!/usr/bin/env python3
import sys, json
import xml.etree.ElementTree as ET

if len(sys.argv) < 3:
    print("Usage: python convert-cobertura.py <input> <output>")
    sys.exit(1)

input_file, output_file = sys.argv[1], sys.argv[2]

tree = ET.parse(input_file)
root = tree.getroot()

summary = {
    "workflow": "coverage-checks",
    "job": "cobertura",
    "status": "success",
    "errors": [],
    "warnings": [],
    "notices": []
}

threshold = 80.0  # adjust as needed

for cls in root.findall(".//class"):
    filename = cls.attrib.get("filename")
    line_rate = float(cls.attrib.get("line-rate", "0")) * 100
    if line_rate < threshold:
        summary["errors"].append({
            "file": filename,
            "line": None,
            "message": f"Coverage {line_rate:.2f}% below threshold {threshold}%",
            "rule": "coverage-threshold",
            "severity": "error",
            "suggestion": "Increase test coverage for this file."
        })
        summary["status"] = "failure"

with open(output_file, "w") as f:
    json.dump(summary, f, indent=2)

print(f"✅ Cobertura coverage summary written to {output_file}")