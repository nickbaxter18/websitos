# -------------------------
# Frontend Build Stage
# -------------------------
FROM node:20 AS frontend-builder

WORKDIR /app/frontend

# Copy dependency files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source
COPY frontend ./

# Build frontend
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

# Copy built frontend into FastAPI dist folder
RUN mkdir -p /app/dist
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Add non-root user
RUN useradd -m appuser
USER appuser

# Expose FastAPI port
EXPOSE 8000

# Healthcheck
HEALTHCHECK CMD curl -f http://localhost:8000/api/health || exit 1

# Run FastAPI with uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]