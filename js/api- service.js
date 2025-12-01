// File: js/api-service.js (NEW FILE - create this)

// Import config if using modules
// import CONFIG from './config.js';

// OR use global config
const CONFIG = window.CONFIG || {
    BACKEND_URL: 'https://football-ai-backend-odhw.onrender.com',
    ENDPOINTS: {
        PREDICT: '/api/predict',
        LIVE_MATCHES: '/api/live-matches',
        LEAGUES: '/api/leagues',
        TEAMS: '/api/teams',
        HEALTH: '/health'
    }
};

class APIService {
    constructor() {
        this.baseUrl = CONFIG.BACKEND_URL;
        this.endpoints = CONFIG.ENDPOINTS;
        this.cache = new Map();
        this.cacheDuration = 30000; // 30 seconds cache
    }
function displayPrediction(data) {
    const prediction = data.prediction; // "Home Win"
    const confidence = data.confidence; // 57
    
    // Create prediction card
    return `
        <div class="prediction-card">
            <h3>Prediction: ${prediction}</h3>
            <div class="confidence">
                Confidence: 
                <span class="confidence-value ${getConfidenceClass(confidence)}">
                    ${confidence}%
                </span>
            </div>
            <div class="probabilities">
                <div class="prob home-win">
                    <div class="prob-label">Home Win</div>
                    <div class="prob-bar" style="width: ${data.probabilities.home_win}%"></div>
                    <div class="prob-value">${data.probabilities.home_win}%</div>
                </div>
                <div class="prob draw">
                    <div class="prob-label">Draw</div>
                    <div class="prob-bar" style="width: ${data.probabilities.draw}%"></div>
                    <div class="prob-value">${data.probabilities.draw}%</div>
                </div>
                <div class="prob away-win">
                    <div class="prob-label">Away Win</div>
                    <div class="prob-bar" style="width: ${data.probabilities.away_win}%"></div>
                    <div class="prob-value">${data.probabilities.away_win}%</div>
                </div>
            </div>
        </div>
    `;
    function getBettingAdvice(data) {
    const probabilities = data.probabilities;
    const analysis = data.analysis;
    
    let advice = [];
    
    // 1. Main bet
    if (probabilities.home_win > 50) {
        advice.push(`Bet on HOME WIN (${probabilities.home_win}% chance)`);
    } else if (probabilities.away_win > 50) {
        advice.push(`Bet on AWAY WIN (${probabilities.away_win}% chance)`);
    } else if (probabilities.draw > 40) {
        advice.push(`Consider DRAW (${probabilities.draw}% chance)`);
    }
    
    // 2. Over/Under goals
    if (analysis.over_2_5_goals_prob > 60) {
        advice.push(`Good chance for OVER 2.5 goals (${analysis.over_2_5_goals_prob}%)`);
    }
    
    // 3. Both teams to score
    if (analysis.both_teams_score_prob > 55) {
        advice.push(`Both teams likely to score (${analysis.both_teams_score_prob}%)`);
    }
    
    return advice;
        function displayExpectedGoals(data) {
    const xgHome = data.analysis.expected_goals_home;
    const xgAway = data.analysis.expected_goals_away;
    
    return `
        <div class="xg-analysis">
            <h4>Expected Goals (xG)</h4>
            <div class="xg-bars">
                <div class="xg-home">
                    <div class="team">${data.match.home_team}</div>
                    <div class="xg-bar" style="width: ${(xgHome / 5) * 100}%"></div>
                    <div class="xg-value">${xgHome.toFixed(1)}</div>
                </div>
                <div class="xg-away">
                    <div class="team">${data.match.away_team}</div>
                    <div class="xg-bar" style="width: ${(xgAway / 5) * 100}%"></div>
                    <div class="xg-value">${xgAway.toFixed(1)}</div>
                </div>
            </div>
            <p class="xg-note">Higher xG = Better scoring chances</p>
        </div>
    `;
        // Complete prediction display function
async function showMatchPrediction(homeTeam, awayTeam, league) {
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                home_team: homeTeam,
                away_team: awayTeam,
                league: league
            })
        });
        
        const prediction = await response.json();
        
        // Display all prediction data
        document.getElementById('result').innerHTML = `
            <div class="prediction-result">
                <h2>${prediction.match.home_team} vs ${prediction.match.away_team}</h2>
                <h3 class="prediction-main">${prediction.prediction}</h3>
                <p class="confidence">Confidence: ${prediction.confidence}%</p>
                
                ${displayProbabilities(prediction.probabilities)}
                ${displayExpectedGoals(prediction.analysis)}
                ${displayKeyFactors(prediction.analysis.key_factors)}
                
                <p class="timestamp">Generated: ${new Date(prediction.timestamp).toLocaleString()}</p>
            </div>
        `;
        
    } catch (error) {
        console.error('Error:', error);
    }
}    
    }
    }
    }
    
}

// Create global instance
window.apiService = new APIService();
