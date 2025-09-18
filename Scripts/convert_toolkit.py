import os
import hashlib
import datetime
import shutil
import zipfile

# Input Zips
TOOLKIT_DIR = "toolkits"
INPUT_DIR = "toolkit_playbooks"

# Output dirs
OUTPUT_MODULES = "v2/core/modules"
OUTPUT_TEMPLATES = "v2/templates/partials"
META_GARDENING = "docs/meta/gardening"
META_PRUNED = "docs/meta/pruned.md"
META_HEALTH = "docs/meta/health.md"
ARCHIVE = "docs/meta/archive"

# Ensure dirs exist
for d in [OUTPUT_MODULES, OUTPUT_TEMPLATES, META_GARDENING, ARCHIVE]:
    os.makedirs(d, exist_ok=True)


def unzip_toolkits():
    """Unpack all zips in TOOLKIT_DIR into INPUT_DIR"""
    os.makedirs(INPUT_DIR, exist_ok=True)
    if not os.path.exists(TOOLKIT_DIR):
        print(
            f"⚠️ No '{TOOLKIT_DIR}' folder found. Create it and drop toolkit zips inside."
        )
        return
    for file in os.listdir(TOOLKIT_DIR):
        if file.endswith(".zip"):
            zip_path = os.path.join(TOOLKIT_DIR, file)
            print(f"📦 Extracting {file}...")
            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(INPUT_DIR)


def classify_role(filename):
    f = filename.lower()
    if "ads" in f or "campaign" in f or "launch" in f or "lead" in f:
        return "seeder"
    if "growth" in f or "personalization" in f or "retention" in f or "seo" in f:
        return "grower"
    if (
        "esg" in f
        or "ethics" in f
        or "compliance" in f
        or "consent" in f
        or "utm" in f
        or "ga4" in f
    ):
        return "pruner"
    if "community" in f or "board" in f or "reconcile" in f:
        return "reconciler"
    return "grower"


def extract_tags(filename):
    return [tag for tag in filename.replace("_", " ").split() if len(tag) > 3]


def file_hash(path):
    h = hashlib.md5()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def write_utf8(path, content, append=False, bom=False):
    mode = "a" if append else "w"
    encoding = "utf-8-sig" if bom else "utf-8"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, mode, encoding=encoding) as f:
        f.write(content)


def wrap_ts_module(name, content):
    """Wrap raw TS module into covenant schema."""
    role = classify_role(name)
    tags = extract_tags(name)
    return f"""
export const {name.title().replace('_','')} = {{
  id: "{name}",
  function: "{name.replace('_',' ')}",
  dependencies: [],
  gardener_role: "{role}",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: {tags},
  apply() {{
    // Original logic
{content}
  }},
  fallback() {{ console.warn("[{name}] fallback safe mode."); }},
  negotiate() {{ return "{name} negotiates between system and culture."; }},
  evolve() {{ return "{name} evolves toward adaptive governance."; }},
  coevolve() {{ return "{name} coevolves with other modules."; }},
  cultivate() {{ return "{name} cultivates cultural resilience."; }}
}}
"""


def convert():
    seen_hashes = {}
    gardening_log, pruned = [], []

    for root, dirs, files in os.walk(INPUT_DIR):
        for file in files:
            path = os.path.join(root, file)
            ext = os.path.splitext(file)[1].lower()
            h = file_hash(path)

            # Deduplicate
            if h in seen_hashes:
                pruned.append(f"- {file} (duplicate of {seen_hashes[h]})")
                shutil.move(path, os.path.join(ARCHIVE, file))
                continue
            seen_hashes[h] = file

            module_name = os.path.splitext(file)[0]

            # JSON → module.ts
            if ext == ".json":
                role = classify_role(file)
                tags = extract_tags(module_name)
                module_code = f"""
export const {module_name.title().replace('_','')} = {{
  id: "{module_name}",
  function: "{module_name.replace('_',' ')}",
  dependencies: [],
  gardener_role: "{role}",
  archetype: "playbook",
  myth_alignment: "growth",
  cultural_tags: {tags},
  apply() {{ return require("./{file}"); }},
  fallback() {{ return {{}}; }},
  negotiate() {{ }},
  evolve() {{ }},
  coevolve() {{ }},
  cultivate() {{ }}
}}
"""
                out_path = os.path.join(
                    OUTPUT_MODULES, "playbooks", f"{module_name}.ts"
                )
                write_utf8(out_path, module_code, append=False)
                gardening_log.append(f"[SEED] {module_name} -> {role}")

            # HTML → partials
            elif ext == ".html":
                shutil.copy(path, os.path.join(OUTPUT_TEMPLATES, file))
                gardening_log.append(f"[GROW] Template added {file}")

            # TS → wrap into covenant schema
            elif ext == ".ts":
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    raw = f.read()
                module_code = wrap_ts_module(module_name, raw)
                out_path = os.path.join(OUTPUT_MODULES, "special", f"{module_name}.ts")
                write_utf8(out_path, module_code, append=False)
                gardening_log.append(
                    f"[SPECIAL] {module_name} wrapped as covenant module"
                )

    # Logs
    if pruned:
        write_utf8(META_PRUNED, "\n".join(pruned) + "\n", append=True, bom=True)
    if gardening_log:
        gardening_file = os.path.join(META_GARDENING, f"log_{datetime.date.today()}.md")
        write_utf8(
            gardening_file, "\n".join(gardening_log) + "\n", append=False, bom=True
        )
    write_utf8(
        META_HEALTH,
        f"\nCycle {datetime.date.today()} -> Modules {len(seen_hashes)} | Pruned {len(pruned)}\n",
        append=True,
        bom=True,
    )


if __name__ == "__main__":
    unzip_toolkits()
    convert()
    print("✅ Toolkit + Special Modules conversion complete!")
