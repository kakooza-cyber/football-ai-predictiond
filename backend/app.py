from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import random

app = FastAPI(title="FootPredict AI API")

# Allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    league: str

@app.get("/")
async def root():
    return {"message": "FootPredict AI API is running!", "status": "active"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/predict")
async def predict_match(request: PredictionRequest):
    # Simulate AI prediction
    home_win = random.randint(40, 80)
    draw = random.randint(10, 30)
    away_win = 100 - home_win - draw
    
    return {
        "home_team": request.home_team,
        "away_team": request.away_team,
        "league": request.league,
        "prediction": f"{request.home_team} Win",
        "confidence": home_win,
        "home_win_prob": home_win,
        "draw_prob": draw,
        "away_win_prob": away_win,
        "expected_goals_home": round(random.uniform(1.5, 3.5), 1),
        "expected_goals_away": round(random.uniform(0.8, 2.8), 1),
        "both_teams_score_prob": random.randint(40, 80),
        "over_2_5_goals_prob": random.randint(50, 85),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/live-matches")
async def get_live_matches():
    teams = ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham"]
    matches = []
    
    for i in range(3):
        home = random.choice(teams)
        away = random.choice([t for t in teams if t != home])
        
        matches.append({
            "id": i + 1,
            "home_team": home,
            "away_team": away,
            "score": f"{random.randint(0, 3)}-{random.randint(0, 2)}",
            "minute": random.randint(30, 85),
            "status": "LIVE"
        })
    
    return {"live_matches": matches}

# Remove the if __name__ block since uvicorn runs the app
