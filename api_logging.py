import logging
import time
import json
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        response = None
        error = None
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            error = str(e)
            raise
        finally:
            process_time = time.time() - start_time

            log_data = {
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code if response else 500,
                "process_time_ms": round(process_time * 1000, 2),
                "client": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
            }
            if error:
                log_data["error"] = error

            logging.info(json.dumps(log_data))
