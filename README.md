# PrePost Analytics

A full-stack YouTube analytics platform that predicts video performance before you hit publish.

Built using machine learning models to help content creators make data-driven decisions about their content strategy.
Live Demo: prepost-analytics.vercel.app

---

## What Does It Do?

Ever wondered how your video will do before uploading it? PrePost Analytics uses AI to predict how your YouTube videos will perform based on your title, thumbnail, category, and channel size. It's like having a crystal ball for your content strategy.

The platform analyzes patterns from thousands of successful videos and your own channel's performance to give you:

- Predicted view counts
- Expected engagement rates
- Click-through rate estimates
- Actionable recommendations to improve performance

---

## Why I Built This

As someone interested in both content creation and machine learning, I wanted to solve a real problem: the uncertainty creators face when publishing content.

This project combines my passion for AI with practical application. It shows how machine learning can help creators predict what would attract views and aid them with decision making.

---

## Key Features

**AI-Powered Predictions**
- Ensemble model combining XGBoost, BERT, and CNN
- Trained on 51,888 YouTube videos
- 95.6% R² accuracy on test data
- Predictions in under 10 seconds

**Performance Analytics**
- Analyze your channel's most recent videos
- Identify what generated the most views
- Track trends over time
- Compare against similar channels

**Recommendations**
- Title optimization suggestions
- Recommends the best thumbnail out of 2-5 options
- Posting time insights

**Privacy-Focused**
- No permanent data storage
- Real-time predictions
- Secure authentication with JWT
- Google OAuth integration

---

## Tech Stack

**Backend (Python)**
- **FastAPI** — Fast API framework with automatic documentation
- **SQLAlchemy** — Database ORM for flexible data management
- **PostgreSQL** — Relational database
- **PyTorch & Transformers** — Deep learning for text analysis
- **XGBoost** — Gradient boosting for numerical predictions
- **Pillow** — Image processing for thumbnail analysis

**Frontend (JavaScript)**
- **React** — Component-based UI for maintainability
- **Vite** — Fast build tool and dev server
- **TailwindCSS** — Utility-first styling
- **React Router** — Client-side routing

**ML Pipeline**
- **BERT** — Pre-trained language model for title embeddings
- **CNN** — Convolutional neural network for thumbnail features
- **XGBoost** — Ensemble model combining all features
- **scikit-learn** — Data preprocessing and encoding

**DevOps**
- **Docker** — Containerization for consistent environments
- **Render** — Backend hosting
- **Vercel** — Frontend hosting
- **Neon** — Serverless PostgreSQL

---

## How It Works

1. **Data Collection** — The model was trained on a dataset of 51,888 YouTube videos with their performance metrics
2. **Feature Engineering** — Extracts features from title (BERT embeddings), thumbnail (CNN features), category, and subscriber count
3. **Ensemble Prediction** — Combines three models for the final predictions
4. **Real-time Analysis** — Processes the input and returns predictions in under a couple of seconds

---

## Project Structure

```
prepost-analytics/
├── backend/                 # FastAPI backend server
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   └── routes/     # Auth, predictions, analytics
│   │   ├── core/           # Configuration and security
│   │   ├── db/             # Database connection
│   │   ├── ml/             # Machine learning models
│   │   │   └── models/     # Trained model files
│   │   ├── models/         # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── requirements.txt    # Python dependencies
│   └── run.py             # Server entry point
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── services/      # API integration
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Build configuration
│
├── sql/                   # Database schemas
│   └── postgresql_schema.sql

```

---

## Getting Started

### Prerequisites

- Python 3.12 or higher
- Node.js 18 or higher
- PostgreSQL or SQL Server
- YouTube Data API key
- Google OAuth credentials

### Local Development Setup

**1. Clone the repository**
```bash
git clone https://github.com/haaj-1/PrePostTube-Analytics.git
cd PrePostTube-Analytics
```

**2. Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys and database URL

# Run the server
python run.py
```

The backend will start at `http://localhost:5000`

**3. Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Run development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### Environment Variables

**Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@localhost/prepost_analytics
SECRET_KEY=your-secret-key-here
YOUTUBE_API_KEY=your-youtube-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
MODEL_PATH=./app/ml/models
```

**Frontend (.env)**
```env
VITE_YOUTUBE_API_KEY=your-youtube-api-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_ML_API_URL=http://localhost:5000
```

---

## Deployment

The app is currently deployed with a free-tier stack:

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Vercel | Free forever |
| Backend | Render | Free tier, ML features disabled |
| Database | Neon PostgreSQL | Free tier |

> **Note:** The free deployment runs without ML prediction features due to memory constraints. To access full ML functionality, I would need to upgrade to Render's Starter plan, as right now the ML prediction features only run locally.

---

## ML Model Details

**1. Text Analysis (BERT)**
- Processes video titles to understand semantic meaning
- Generates 768-dimensional embeddings
- Captures context and sentiment

**2. Image Analysis (CNN)**
- Analyzes thumbnail visual features
- Extracts color patterns, composition, and text presence
- Generates feature vectors for prediction

**3. Ensemble Model (XGBoost)**
- Combines BERT embeddings, CNN features, category, and subscriber count
- Gradient boosting for robust predictions
- Handles non-linear relationships

**Performance Metrics**

| Metric | Value |
|--------|-------|
| R² Score | 95.6% |
| Mean Absolute Error | ~12% of actual views |
| Prediction Time | 0.5–1 second |

---

## Challenges & Solutions

**Model Size**
- Problem: ML models (2GB+) too large for free hosting
- Solution: Created minimal deployment without ML; full version for local/paid hosting

**Cold Starts**
- Problem: Loading models on each request took 5–8 seconds
- Solution: Load models once at startup, reducing prediction time to <1 second

**Database Compatibility**
- Problem: SQL Server (local) vs PostgreSQL (production)
- Solution: SQLAlchemy ORM for database-agnostic code

**Python 3.14 Compatibility**
- Problem: Render used Python 3.14, incompatible with some libraries
- Solution: Upgraded SQLAlchemy and switched to psycopg3

---

## Future Improvements

- [ ] Historical A/B test tracking and analytics
- [ ] Implement video scheduling recommendations
- [ ] Add competitor analysis features
- [ ] Create mobile app version
- [ ] Expand to other platforms (TikTok, Instagram)
- [ ] Add real-time trend analysis

---

## Contributing

Contributions are welcome — bug fixes, feature additions, or documentation improvements.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgments

- Dataset sourced from Kaggle's YouTube trending videos
- BERT model from Hugging Face Transformers

---

## Contact

- GitHub: [@haaj-1](https://github.com/haaj-1)
- Project: [PrePostTube-Analytics](https://github.com/haaj-1/PrePostTube-Analytics)
- Live Demo: [prepost-analytics.vercel.app](https://prepost-analytics.vercel.app)
