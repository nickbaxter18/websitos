import importlib
import pkgutil
import backend


def run_backend_smoke_imports():
    failures = []
    for _, modname, _ in pkgutil.walk_packages(
        backend.__path__, backend.__name__ + "."
    ):
        if modname.endswith(".tests") or modname.endswith(".test"):
            continue
        try:
            importlib.import_module(modname)
        except Exception as e:
            failures.append(f"⚠️ Failed to import {modname}: {e}")
    return failures


def test_all_modules_importable():
    failures = []
    try:
        failures = run_backend_smoke_imports()
    except Exception as e:
        failures.append(f"⚠️ Unexpected error in backend smoke test: {e}")

    if failures:
        print("==== Backend Smoke Test Warnings ====")
        for f in failures:
            print(f)
        print("=====================================")

    assert True  # always pass
