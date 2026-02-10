# PrePost Analytics Backend

FastAPI backend with ML predictions and YouTube API integration.

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run server:**
   ```bash
   python run.py
   ```

## API Endpoints

- **POST /predict/** - Video performance prediction
- **POST /predict/analyze-caption** - BERT caption analysis
- **GET /youtube/channel/{id}** - Channel statistics
- **GET /youtube/trending** - Trending videos
- **POST /auth/register** - User registration
- **POST /auth/login** - User login

## Project Structure

```
backend/
├── app/
│   ├── api/routes/     # API endpoints
│   ├── core/           # Configuration
│   ├── db/             # Database
│   ├── models/         # Pydantic schemas
│   └── services/       # Business logic
├── models/             # ML model files
└── main.py            # FastAPI app
```