 // config.js
const API_CONFIG = {
    BASE_URL: 'https://football-ai-backend-odhw.onrender.com',  // Backend URL
    LOCAL_BASE_URL:'htts://localhost:5000',//local
    ENDPOINTS: {
        PREDICT: '/api/predict',
        LIVE_MATCHES: '/api/live-matches',
        LEAGUES: '/api/leagues',
        TEAMS: '/api/teams',
    }
};

window.CONFIG = CONFIG;
    
    // Update intervals in milliseconds
    INTERVALS: {
        LIVE_MATCHES: 30000,    // 30 seconds
        PREDICTIONS: 600000     // 10 minutes
    }
};

console.log('FootPredict AI Config loaded');
