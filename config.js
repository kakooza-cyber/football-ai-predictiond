 // config.js
const API_CONFIG = {
    BASE_URL: 'https://football-ai-backend-odhw.onrender.com/docs',  // Backend URL
    ENDPOINTS: {
        PREDICT: '/api/predict',
        LIVE_MATCHES: '/api/live-matches',
        LEAGUES: '/api/leagues',
        TEAMS: '/api/teams'
    }
};

export default API_CONFIG;
    
    // Update intervals in milliseconds
    INTERVALS: {
        LIVE_MATCHES: 30000,    // 30 seconds
        PREDICTIONS: 600000     // 10 minutes
    }
};

console.log('FootPredict AI Config loaded');
