import random
from datetime import datetime

class DataProcessor:
    def __init__(self):
        self.teams = {
            "premier_league": [
                "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton",
                "Chelsea", "Crystal Palace", "Everton", "Fulham", "Leeds",
                "Leicester", "Liverpool", "Manchester City", "Manchester United",
                "Newcastle", "Nottingham Forest", "Southampton", "Tottenham", "West Ham", "Wolves"
            ]
        }
    
    def get_simulated_live_matches(self):
        matches = []
        
        for _ in range(3):
            home_team = random.choice(self.teams["premier_league"])
            away_team = random.choice([t for t in self.teams["premier_league"] if t != home_team])
            
            minute = random.randint(1, 89)
            home_goals = random.randint(0, minute // 20)
            away_goals = random.randint(0, minute // 20)
            
            events = []
            for time in sorted(random.sample(range(1, minute), min(3, home_goals + away_goals))):
                team = random.choice([home_team, away_team])
                events.append({
                    "type": "goal",
                    "team": team,
                    "minute": time
                })
            
            matches.append({
                "home_team": home_team,
                "away_team": away_team,
                "league": "premier_league",
                "score": f"{home_goals}-{away_goals}",
                "minute": minute,
                "status": "LIVE",
                "events": events
            })
        
        return matches
    
    def get_simulated_standings(self, league: str):
        teams = self.teams.get(league, self.teams["premier_league"])
        standings = []
        
        for i, team in enumerate(teams):
            played = random.randint(20, 30)
            wins = random.randint(played // 3, played - 5)
            draws = random.randint(0, played - wins - 1)
            losses = played - wins - draws
            points = wins * 3 + draws
            
            form = []
            for _ in range(5):
                form.append(random.choice(["W", "D", "L"]))
            
            standings.append({
                "position": i + 1,
                "team": team,
                "played": played,
                "won": wins,
                "drawn": draws,
                "lost": losses,
                "goals_for": random.randint(20, 60),
                "goals_against": random.randint(10, 40),
                "goal_difference": random.randint(-10, 30),
                "points": points,
                "form": form
            })
        
        standings.sort(key=lambda x: x["points"], reverse=True)
        for i in range(len(standings)):
            standings[i]["position"] = i + 1
        
        return standings
