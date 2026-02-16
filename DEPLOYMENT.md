# Deployment Guide - 100% Free Hosting

## Stack
- **Frontend**: Vercel (Free forever)
- **Backend**: Render (Free forever - 512MB RAM, sleeps after 15min)
- **Database**: Neon PostgreSQL (Free forever - 0.5GB)

## Prerequisites
1. GitHub account
2. Vercel account (sign up at vercel.com)
3. Render account (sign up at render.com)
4. Neon account (sign up at neon.tech)

---

## Step 1: Deploy Database (Neon)

1. Go to [Neon Console](https://console.neon.tech/)
2. Click **Create a project**
3. Configure:
   - **Project name**: `prepost-analytics`
   - **Database name**: `prepost_analytics`
   - **Region**: **Frankfurt (EU Central)** - Closest to Qatar
   - **PostgreSQL version**: 16 or 17
4. Click **Create project**
5. Copy the **Connection string** (starts with `postgresql://`)
6. In the Neon dashboard, click **SQL Editor**
7. Copy and paste the contents of `sql/postgresql_schema.sql` and run it
   - This creates all tables and schemas

**Note**: Save your connection string - you'll need it for the backend!

---

## Step 2: Deploy Backend (Render)

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Go to Render Dashboard
3. Click **New +** → **Blueprint**
4. Connect your GitHub repository
5. Render will auto-detect `render.yaml`
6. Add environment variables:
   - `YOUTUBE_API_KEY`: Your YouTube API key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth secret
7. Click **Apply**

### Option B: Manual Setup

1. Go to Render Dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `prepost-backend`
   - **Region**: Frankfurt (EU Central) - Same region as database
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Add Environment Variables:
   - `DATABASE_URL`: Paste your Neon connection string
   - `SECRET_KEY`: Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `30`
   - `YOUTUBE_API_KEY`: Your YouTube API key
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth secret
   - `MODEL_PATH`: `./app/ml/models`
6. Click **Create Web Service**

**Note**: First deploy will take 10-15 minutes due to ML library installation.

---

## Step 3: Deploy Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variables:
   - `VITE_YOUTUBE_API_KEY`: Your YouTube API key
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `VITE_ML_API_URL`: Your Render backend URL (e.g., `https://prepost-backend.onrender.com`)
6. Click **Deploy**

---

## Step 4: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to: APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add **Authorized JavaScript origins**:
   - Your Vercel domain (e.g., `https://your-app.vercel.app`)
5. Add **Authorized redirect URIs**:
   - `https://your-app.vercel.app/auth/callback`
   - `https://your-app.vercel.app`
6. Click **Save**

---

## Step 5: Update Frontend with Backend URL

After backend is deployed, update frontend environment variable:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_ML_API_URL` to your Render backend URL
3. Redeploy frontend

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- 512MB RAM
- Spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- 750 hours/month (enough for one service)

**Neon Free Tier:**
- 0.5GB storage (enough for ~50,000-100,000 predictions)
- Free forever
- Autoscaling (scales to zero when not in use)
- 1 project, unlimited databases

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Performance Optimization

The ML models are large (~2GB). For free tier:

1. **Option 1**: Use `requirements-minimal.txt` (no ML features)
   - Change build command to: `pip install -r requirements-minimal.txt`
   - Disable ML endpoints

2. **Option 2**: Keep ML but expect slow cold starts
   - First request after sleep: 30-60 seconds
   - Subsequent requests: normal speed

### Monitoring

- **Render**: Check logs in dashboard
- **Vercel**: Check deployment logs and analytics
- **Database**: Monitor connection count in Render dashboard

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is set correctly
- Ensure all environment variables are set

### Frontend can't connect to backend
- Verify VITE_ML_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running (not sleeping)

### Database connection errors
- Verify schema was created (run postgresql_schema.sql)
- Check DATABASE_URL format
- Ensure database is running

### Google OAuth not working
- Verify authorized origins in Google Cloud Console
- Check GOOGLE_CLIENT_ID matches in both frontend and backend
- Ensure redirect URIs are correct

---

## Alternative: Railway (All-in-One)

Railway offers $5 free credit/month:

1. Go to [Railway](https://railway.app/)
2. Create new project
3. Add PostgreSQL database
4. Add backend service (auto-detects Python)
5. Add environment variables
6. Deploy frontend to Vercel (same as above)

**Pros**: Simpler setup, one platform
**Cons**: $5/month credit runs out faster with both services

---

## Cost Comparison

| Platform | Free Tier | Notes |
|----------|-----------|-------|
| Vercel (Frontend) | Free forever | 100GB bandwidth/month |
| Render (Backend) | Free forever* | *Sleeps after 15min inactivity |
| Neon (PostgreSQL) | Free forever | 0.5GB storage, autoscaling |

**Total Cost: $0/month forever!**

---

## Next Steps

After deployment:
1. Test all features
2. Monitor error logs
3. Set up custom domain (optional)
4. Configure analytics (optional)
5. Set up monitoring/alerts

Need help? Check Render/Vercel documentation or create an issue.
