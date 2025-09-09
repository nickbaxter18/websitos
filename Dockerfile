# -------------------------
# Frontend Build Stage
# -------------------------
FROM node:20 AS frontend-builder

WORKDIR /app

# Copy dependency files first (better caching)
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy frontend source (adjust if your frontend is not in v2/)
COPY v2 ./v2
COPY public ./public

# Build frontend (adjust if your script differs)
RUN npm run build

# -------------------------
# Backend Build Stage
# -------------------------
FROM python:3.11-slim AS backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . .

# Copy built frontend from Node stage into FastAPI static folder
RUN mkdir -p /app/static
COPY --from=frontend-builder /app/dist /app/static

# Add non-root user
RUN useradd -m appuser
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Healthcheck
HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

# Run FastAPI with uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
