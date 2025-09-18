import importlib
import pkgutil
import backend

def test_all_modules_importable():
    for _, modname, _ in pkgutil.walk_packages(backend.__path__, backend.__name__ + "."):
        importlib.import_module(modname)