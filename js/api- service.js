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
    }
    
}

// Create global instance
window.apiService = new APIService();
