from backend.api import app
from typing import Any


# Entry point for backend services
def get_app() -> Any:
    return app


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
