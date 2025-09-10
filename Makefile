# Makefile for WebsiteOS v2

# Run frontend + backend + Qdrant with Docker Compose
dev:
	docker-compose up --build

# Stop all running containers
down:
	docker-compose down

# Run backend tests with pytest
test-backend:
	docker-compose run --rm backend pytest --maxfail=1 --disable-warnings -q

# Run frontend tests with Jest
test-frontend:
	docker-compose run --rm frontend npm test -- --watchAll=false

# Run frontend E2E tests with Playwright
test-e2e:
	docker-compose run --rm frontend npm run test:e2e

# Lint frontend (eslint + prettier)
lint-frontend:
	docker-compose run --rm frontend npm run lint && npm run format:check

# Format backend (Black)
format-backend:
	docker-compose run --rm backend black .

# Lint backend (Black check)
lint-backend:
	docker-compose run --rm backend black --check .

# Full lint (frontend + backend)
lint:
	make lint-frontend && make lint-backend

# Run type-check for frontend
type-check:
	docker-compose run --rm frontend npm run type-check

# Clean build artifacts
clean:
	docker-compose down -v --remove-orphans
	rm -rf dist node_modules .pytest_cache .mypy_cache coverage .coverage