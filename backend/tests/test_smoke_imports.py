import pytest


def test_import_backend_modules() -> None:
    try:
        import backend.api  # noqa: F401
    except ImportError as e:
        pytest.fail(f"Failed to import backend.api: {e}")


def test_import_backend_submodules() -> None:
    try:
        import backend  # noqa: F401
    except ImportError as e:
        pytest.fail(f"Failed to import backend package: {e}")
