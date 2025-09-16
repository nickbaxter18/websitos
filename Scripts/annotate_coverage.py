#!/usr/bin/env python3
"""
Annotates Pytest XML coverage with GitHub Actions errors.
Usage: python scripts/annotate_coverage.py coverage.xml
"""

import sys
import json
import os
import xml.etree.ElementTree as ET

# Load thresholds from coverage.config.json
config_path = os.path.join(os.path.dirname(__file__), "..", "coverage.config.json")
with open(config_path) as f:
    THRESHOLDS = json.load(f)["thresholds"]


def emit_error(file, line, msg):
    print(f"::error file={file},line={line}::{msg}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/annotate_coverage.py coverage.xml")
        sys.exit(0)

    coverage_file = sys.argv[1]

    try:
        tree = ET.parse(coverage_file)
        root = tree.getroot()
    except Exception as e:
        print(f"::warning::Could not parse coverage file {coverage_file}: {e}")
        sys.exit(0)

    counters = root.findall(".//counter")
    for counter in counters:
        ctype = counter.get("type").lower()
        missed = int(counter.get("missed"))
        covered = int(counter.get("covered"))
        total = missed + covered
        pct = (covered / total * 100) if total > 0 else 100

        if ctype in THRESHOLDS and pct < THRESHOLDS[ctype]:
            emit_error(
                coverage_file,
                1,
                f"Pytest {ctype} coverage {pct:.1f}% < required {THRESHOLDS[ctype]}%"
            )
            sys.exit(1)


if __name__ == "__main__":
    main()