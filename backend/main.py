from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime
import random
import os

# Create the FastAPI instance
app = FastAPI(
    title="FootPredict AI API",
    description="AI-powered football match predictions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    home_team: str
    away_team: str
    league: str

# Sample teams data
SAMPLE_TEAMS = {
    "premier_league": ["Arsenal", "Chelsea", "Liverpool", "Man City", "Man United", "Tottenham"],
    "la_liga": ["Barcelona", "Real Madrid", "Atletico Madrid", "Sevilla"],
    "serie_a": ["Juventus", "matako", "Inter Milan", "Napoli"]
}

@app.get("/")
async def root():
    return {
        "message": "🚀 FootPredict AI API is running!", 
        "status": "active",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/predict")
async def predict_match(request: PredictionRequest):
    """AI-powered match prediction"""
    try:
        home_strength = calculate_team_strength(request.home_team)
        away_strength = calculate_team_strength(request.away_team)
        
        base_home_win = (home_strength / (home_strength + away_strength)) * 100
        base_away_win = (away_strength / (home_strength + away_strength)) * 100
        
        home_advantage = random.uniform(5, 15)
        form_factor = random.uniform(-10, 10)
        
        home_win_prob = min(85, max(15, base_home_win + home_advantage + form_factor))
        away_win_prob = min(80, max(10, base_away_win - home_advantage))
        draw_prob = 100 - home_win_prob - away_win_prob
        
        home_win_prob = max(20, min(80, home_win_prob))
        away_win_prob = max(15, min(70, away_win_prob))
        draw_prob = max(10, min(40, draw_prob))
        
        total = home_win_prob + away_win_prob + draw_prob
        home_win_prob = int((home_win_prob / total) * 100)
        away_win_prob = int((away_win_prob / total) * 100)
        draw_prob = 100 - home_win_prob - away_win_prob
        
        if home_win_prob > away_win_prob and home_win_prob > draw_prob:
            prediction = f"{request.home_team} Win"
            confidence = home_win_prob
        elif away_win_prob > home_win_prob and away_win_prob > draw_prob:
            prediction = f"{request.away_team} Win" 
            confidence = away_win_prob
        else:
            prediction = "Draw"
            confidence = draw_prob
        
        return {
            "match": {
                "home_team": request.home_team,
                "away_team": request.away_team,
                "league": request.league
            },
            "prediction": prediction,
            "confidence": confidence,
            "probabilities": {
                "home_win": home_win_prob,
                "draw": draw_prob,
                "away_win": away_win_prob
            },
            "analysis": {
                "expected_goals_home": round(random.uniform(1.2, 3.2), 1),
                "expected_goals_away": round(random.uniform(0.8, 2.8), 1),
                "both_teams_score_prob": random.randint(45, 85),
                "over_2_5_goals_prob": random.randint(40, 80),
                "key_factors": [
                    f"{request.home_team} has {home_advantage:.1f}% home advantage",
                    f"Recent form: {'Good' if form_factor > 0 else 'Poor'}",
                    f"Team strength: {home_strength:.1f} vs {away_strength:.1f}"
                ]
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/api/live-matches")
async def get_live_matches():
    """Get simulated live matches"""
    matches = []
    
    for i in range(4):
        league = random.choice(["Premier League", "La Liga", "Serie A"])
        league_key = league.lower().replace(" ", "_")
        
        home = random.choice(SAMPLE_TEAMS.get(league_key, SAMPLE_TEAMS["premier_league"]))
        away = random.choice([t for t in SAMPLE_TEAMS.get(league_key, SAMPLE_TEAMS["premier_league"]) if t != home])
        
        matches.append({
            "id": i + 1,
            "home_team": home,
            "away_team": away,
            "league": league,
            "score": f"{random.randint(0, 3)}-{random.randint(0, 2)}",
            "minute": random.randint(1, 90),
            "status": "LIVE",
            "venue": f"{home} Stadium",
            "timestamp": datetime.now().isoformat()
        })
    
    return {"live_matches": matches}

@app.get("/api/leagues")
async def get_leagues():
    """Get available leagues"""
    return {
        "leagues": [
            {"id": 1, "name": "Premier League", "country": "England", "teams": 20, "level": "Top"},
            {"id": 2, "name": "La Liga", "country": "Spain", "teams": 20, "level": "Top"},
            {"id": 3, "name": "Serie A", "country": "Italy", "teams": 20, "level": "Top"},
            {"id": 4, "name": "Bundesliga", "country": "Germany", "teams": 18, "level": "Top"},
            {"id": 5, "name": "Ligue 1", "country": "France", "teams": 18, "level": "Top"}
        ]
    }

@app.get("/api/teams/{league}")
async def get_teams(league: str):
    """Get teams for a specific league"""
    league_key = league.lower().replace(" ", "_")
    teams = SAMPLE_TEAMS.get(league_key, SAMPLE_TEAMS["premier_league"])
    return {"league": league, "teams": teams}

def calculate_team_strength(team_name: str) -> float:
    """Calculate team strength for predictions"""
    elite_teams = ["man city", "arsenal", "liverpool", "real madrid", "barcelona", "bayern"]
    strong_teams = ["chelsea", "man united", "tottenham", "atletico", "inter", "ac milan", "juventus", "napoli"]
    
    team_lower = team_name.lower()
    
    if any(elite in team_lower for elite in elite_teams):
        return random.uniform(0.8, 0.95)
    elif any(strong in team_lower for strong in strong_teams):
        return random.uniform(0.6, 0.8)
    else:
        return random.uniform(0.4, 0.6)

# Remove the if __name__ block completely for Render
