# Docker Deployment Guide

This guide explains how to run PrePost Analytics using Docker.

## Prerequisites

- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Docker Compose (included with Docker Desktop)
- SQL Server running (locally or remote)

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and add your:
- `SECRET_KEY` (generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `YOUTUBE_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL` (if different from default)

### 2. Build and Run

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/docs

### 4. Stop the Application

```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Development Mode

For development with hot-reload:

```bash
# Run with volume mounts for live code changes
docker-compose -f docker-compose.dev.yml up
```

## Production Deployment

### Build for Production

```bash
# Build optimized images
docker-compose build --no-cache

# Tag images for registry
docker tag prepost-backend:latest your-registry/prepost-backend:latest
docker tag prepost-frontend:latest your-registry/prepost-frontend:latest

# Push to registry
docker push your-registry/prepost-backend:latest
docker push your-registry/prepost-frontend:latest
```

### Environment Variables for Production

Set these in your production environment:

```bash
DATABASE_URL=your-production-database-url
SECRET_KEY=your-production-secret-key
YOUTUBE_API_KEY=your-api-key
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Troubleshooting

### Backend won't start

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Database connection: Ensure SQL Server is accessible from Docker
- Missing environment variables: Check `.env` file
- Port conflicts: Ensure port 5000 is not in use

### Frontend won't build

Check logs:
```bash
docker-compose logs frontend
```

Common issues:
- Node modules: Try `docker-compose build --no-cache frontend`
- Memory issues: Increase Docker memory limit in Docker Desktop settings

### Database Connection from Docker

If using local SQL Server on Windows:
- Use `host.docker.internal` instead of `localhost` in DATABASE_URL
- Example: `mssql+pyodbc://host.docker.internal/prepost_analytics?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes`

## Useful Commands

```bash
# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Restart a service
docker-compose restart backend

# Execute command in container
docker-compose exec backend python -c "print('Hello')"

# Access container shell
docker-compose exec backend bash

# Check container status
docker-compose ps

# Remove all containers and volumes
docker-compose down -v --remove-orphans
```

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
│   Port: 80      │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   Backend       │
│   (FastAPI)     │
│   Port: 5000    │
└────────┬────────┘
         │
         │ ODBC
         │
┌────────▼────────┐
│   SQL Server    │
│   (External)    │
└─────────────────┘
```

## Performance Optimization

### Backend
- Uses Python 3.12 slim image
- Multi-stage build for smaller image size
- Health checks for reliability

### Frontend
- Multi-stage build (builder + nginx)
- Gzip compression enabled
- Static asset caching
- Optimized nginx configuration

## Security

- Non-root user in containers
- Environment variables for secrets
- Security headers in nginx
- Health checks for monitoring
- Network isolation with Docker networks

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build images
        run: docker-compose build
      
      - name: Run tests
        run: docker-compose run backend pytest
      
      - name: Push to registry
        run: |
          docker push your-registry/prepost-backend:latest
          docker push your-registry/prepost-frontend:latest
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env`
3. Ensure Docker Desktop is running
4. Check Docker resource limits (CPU/Memory)
