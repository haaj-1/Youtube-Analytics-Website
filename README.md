# PrePost Analytics

YouTube video performance prediction platform using AI/ML.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- SQL Server running (local or remote)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd prepost-analytics
```

2. **Configure environment variables**
```bash
# Copy example file
cp .env.example .env

# Edit .env and add your keys:
# - SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
# - YOUTUBE_API_KEY
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
```

3. **Start with Docker**
```bash
# Windows PowerShell
.\start-docker.ps1

# Or manually
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/docs

### Stop the application
```bash
docker-compose down
```

## 📖 Documentation

- [Docker Deployment Guide](README-DOCKER.md) - Complete Docker setup and troubleshooting
- [Backend README](backend/README.md) - Backend API documentation

## 🛠️ Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment with Python 3.12
py -3.12 -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure .env file
cp .env.example .env
# Edit .env with your keys

# Run server
python run.py
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure .env file
cp .env.example .env
# Edit .env with your keys

# Run development server
npm run dev
```

## 🏗️ Project Structure

```
prepost-analytics/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database
│   │   ├── ml/          # ML models
│   │   ├── models/      # Data models
│   │   └── services/    # Business logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   ├── Dockerfile
│   └── package.json
├── sql/                 # Database schemas
├── docker-compose.yml   # Docker orchestration
└── README-DOCKER.md     # Docker guide
```

## 🎯 Features

- **AI-Powered Predictions**: XGBoost + BERT + CNN ensemble model (95.6% R² accuracy)
- **Performance Analytics**: Analyze 100 most recent videos
- **Personalized Models**: Train on your channel's 40 recent videos
- **CTR Optimization**: Pro tips and recommendations
- **Privacy First**: No data storage, real-time predictions

## 📊 Tech Stack

**Backend:**
- FastAPI (Python 3.12)
- XGBoost, BERT, CNN
- SQL Server
- PyTorch, Transformers

**Frontend:**
- React + Vite
- TailwindCSS
- React Router

**DevOps:**
- Docker & Docker Compose
- Nginx
- Multi-stage builds

## 🔧 Development

### Run in development mode with hot reload

```bash
docker-compose -f docker-compose.dev.yml up
```

### Run tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=mssql+pyodbc://localhost/prepost_analytics?driver=ODBC+Driver+18+for+SQL+Server
SECRET_KEY=your-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env)
```env
VITE_YOUTUBE_API_KEY=your-youtube-api-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ML_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Docker Issues

**Backend won't start:**
```bash
# Check logs
docker-compose logs backend

# Common fix: Database connection
# Use host.docker.internal instead of localhost in DATABASE_URL
```

**Frontend build fails:**
```bash
# Rebuild without cache
docker-compose build --no-cache frontend
```

**Port conflicts:**
```bash
# Check what's using the port
netstat -ano | findstr :5000
netstat -ano | findstr :80
```

### Manual Setup Issues

**Python package errors:**
- Ensure you're using Python 3.12
- Try: `pip install --upgrade pip`
- Use virtual environment

**Node module errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📧 Support

For issues or questions, please open a GitHub issue.
