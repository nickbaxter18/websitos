# -------------------------
# Frontend Build Stage
# -------------------------
FROM node:20 AS frontend-builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build frontend into /app/dist and list contents for debugging
RUN npm run build && ls -R /app/dist

# -------------------------
# Backend Build Stage
# -------------------------
FROM python:3.11-slim AS backend

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source (ignore dist via .dockerignore)
COPY . .

# ❌ Remove any stale dist
RUN rm -rf dist

# ✅ Copy built frontend fresh
COPY --from=frontend-builder /app/dist ./dist

RUN useradd -m appuser
USER appuser

EXPOSE 8000
HEALTHCHECK CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]