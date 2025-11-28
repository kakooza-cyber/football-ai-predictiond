# Deployment Guide

## Backend Deployment (Render.com)

1. **Go to [Render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - **Name:** `football-ai-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`

## Frontend Deployment (GitHub Pages)

1. **Go to your repository on GitHub**
2. **Settings → Pages**
3. **Source:** `Deploy from a branch`
4. **Branch:** `main` → `/frontend` folder
5. **Save**

## Update Configuration

After deployment, update `frontend/config.js`:
```javascript
window.CONFIG = {
    BACKEND_URL: 'https://your-backend-url.onrender.com'
};
