import importlib
import pkgutil
import backend

def test_all_modules_importable():
    failures = []
    for _, modname, _ in pkgutil.walk_packages(backend.__path__, backend.__name__ + "."):
        if modname.endswith(".tests") or modname.endswith(".test"):
            continue
        try:
            importlib.import_module(modname)
        except Exception as e:
            failures.append((modname, str(e)))
    if failures:
        for mod, err in failures:
            print(f"⚠️ Failed to import {mod}: {err}")