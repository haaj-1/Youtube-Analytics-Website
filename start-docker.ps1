# PowerShell script to start Docker containers

Write-Host "🐳 Starting PrePost Analytics with Docker..." -ForegroundColor Cyan

# Check if Docker is running
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "📝 Please edit .env file with your API keys before continuing." -ForegroundColor Yellow
    Write-Host "   Required: SECRET_KEY, YOUTUBE_API_KEY, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET" -ForegroundColor Yellow
    
    $continue = Read-Host "Have you configured .env? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Exiting. Please configure .env and run again." -ForegroundColor Red
        exit 1
    }
}

# Build and start containers
Write-Host "`n🔨 Building Docker images..." -ForegroundColor Cyan
docker-compose build

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
    Write-Host "`n🚀 Starting containers..." -ForegroundColor Cyan
    docker-compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Containers started successfully!" -ForegroundColor Green
        Write-Host "`n📍 Access your application:" -ForegroundColor Cyan
        Write-Host "   Frontend:  http://localhost" -ForegroundColor White
        Write-Host "   Backend:   http://localhost:5000" -ForegroundColor White
        Write-Host "   API Docs:  http://localhost:5000/docs" -ForegroundColor White
        Write-Host "`n📊 View logs:" -ForegroundColor Cyan
        Write-Host "   docker-compose logs -f" -ForegroundColor White
        Write-Host "`n🛑 Stop containers:" -ForegroundColor Cyan
        Write-Host "   docker-compose down" -ForegroundColor White
    } else {
        Write-Host "`n❌ Failed to start containers. Check logs with: docker-compose logs" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n❌ Build failed. Check the error messages above." -ForegroundColor Red
    exit 1
}
