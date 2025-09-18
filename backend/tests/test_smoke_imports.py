import pytest


def test_import_backend_modules() -> None:
    try:
        import backend  # noqa: F401
    except ImportError as e:
        pytest.fail(f"Failed to import backend: {e}")


def test_import_backend_submodules() -> None:
    try:
        import backend.module1  # noqa: F401
        import backend.module2  # noqa: F401
    except ImportError as e:
        pytest.fail(f"Failed to import backend submodules: {e}")