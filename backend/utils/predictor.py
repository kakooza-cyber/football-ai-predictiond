import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
import os
import random
from datetime import datetime

class FootballPredictor:
    def __init__(self):
        self.model = None
        self.team_encoder = LabelEncoder()
        self.league_encoder = LabelEncoder()
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Train a simple model for demonstration"""
        teams = [
            "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
            "Chelsea", "Crystal Palace", "Everton", "Fulham", "Leeds",
            "Leicester", "Liverpool", "Manchester City", "Manchester United",
            "Newcastle", "Nottingham Forest", "Southampton", "Tottenham", "West Ham", "Wolves"
        ]
        
        # Create training data
        training_data = []
        for _ in range(5000):
            home_team = random.choice(teams)
            away_team = random.choice([t for t in teams if t != home_team])
            league = "premier_league"
            
            # Simple simulation
            home_strength = random.randint(40, 95)
            away_strength = random.randint(40, 95)
            
            total_strength = home_strength + away_strength
            home_win_prob = home_strength / total_strength
            away_win_prob = away_strength / total_strength
            draw_prob = 0.2  # Base draw probability
            
            # Normalize
            total = home_win_prob + draw_prob + away_win_prob
            home_win_prob /= total
            draw_prob /= total
            away_win_prob /= total
            
            rand = random.random()
            if rand < home_win_prob:
                outcome = "home_win"
            elif rand < home_win_prob + draw_prob:
                outcome = "draw"
            else:
                outcome = "away_win"
            
            training_data.append({
                'home_team': home_team,
                'away_team': away_team,
                'league': league,
                'home_strength': home_strength,
                'away_strength': away_strength,
                'outcome': outcome
            })
        
        df = pd.DataFrame(training_data)
        
        # Encode
        all_teams = list(set(df['home_team'].tolist() + df['away_team'].tolist()))
        self.team_encoder.fit(all_teams)
        self.league_encoder.fit(df['league'])
        
        df['home_team_encoded'] = self.team_encoder.transform(df['home_team'])
        df['away_team_encoded'] = self.team_encoder.transform(df['away_team'])
        df['league_encoded'] = self.league_encoder.transform(df['league'])
        
        # Train model
        features = ['home_team_encoded', 'away_team_encoded', 'league_encoded', 'home_strength', 'away_strength']
        X = df[features]
        y = df['outcome']
        
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.model.fit(X, y)
        
        print("AI Model trained and ready!")
    
    def predict_single_match(self, home_team: str, away_team: str, league: str):
        """Make prediction for a match"""
        try:
            home_encoded = self.team_encoder.transform([home_team])[0]
            away_encoded = self.team_encoder.transform([away_team])[0]
            league_encoded = self.league_encoder.transform([league])[0]
        except:
            # Use average encoding if team not found
            home_encoded = len(self.team_encoder.classes_) // 2
            away_encoded = len(self.team_encoder.classes_) // 2
            league_encoded = 0
        
        # Generate realistic stats
        home_strength = random.randint(50, 90)
        away_strength = random.randint(50, 90)
        
        features = np.array([[
            home_encoded, away_encoded, league_encoded, home_strength, away_strength
        ]])
        
        # Get probabilities
        probabilities = self.model.predict_proba(features)[0]
        class_labels = self.model.classes_
        
        probs = {label: prob for label, prob in zip(class_labels, probabilities)}
        
        home_win_prob = probs.get('home_win', 0.33)
        draw_prob = probs.get('draw', 0.33)
        away_win_prob = probs.get('away_win', 0.34)
        
        # Determine winner
        max_prob = max(home_win_prob, draw_prob, away_win_prob)
        if max_prob == home_win_prob:
            prediction = f"{home_team} Win"
        elif max_prob == away_win_prob:
            prediction = f"{away_team} Win"
        else:
            prediction = "Draw"
        
        # Calculate additional metrics
        expected_goals_home = (home_win_prob + draw_prob * 0.5) * 2.8
        expected_goals_away = (away_win_prob + draw_prob * 0.5) * 2.8
        
        both_teams_score_prob = min(0.8, (expected_goals_home * expected_goals_away) / 4)
        total_expected_goals = expected_goals_home + expected_goals_away
        over_2_5_prob = min(0.9, total_expected_goals / 3)
        
        return {
            "prediction": prediction,
            "confidence": round(max_prob * 100, 1),
            "home_win_prob": round(home_win_prob * 100, 1),
            "draw_prob": round(draw_prob * 100, 1),
            "away_win_prob": round(away_win_prob * 100, 1),
            "expected_goals_home": round(expected_goals_home, 1),
            "expected_goals_away": round(expected_goals_away, 1),
            "both_teams_score_prob": round(both_teams_score_prob * 100, 1),
            "over_2_5_goals_prob": round(over_2_5_prob * 100, 1),
            "timestamp": datetime.now().isoformat()
      }
