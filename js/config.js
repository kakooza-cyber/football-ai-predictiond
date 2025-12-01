// File: js/config.js
const CONFIG = {
    BACKEND_URL: 'https://football-ai-backend-odhw.onrender.com', // Your Render URL
    LOCAL_BACKEND_URL: 'http://localhost:5000', // For local development
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    ENV: 'production', // Change to 'development' when working locally
    ENDPOINTS: {
        PREDICT: '/api/predict',
        LIVE_MATCHES: '/api/live-matches',
        LEAGUES: '/api/leagues',
        TEAMS: '/api/teams/{league}',
        HEALTH: '/health'
    }
};

// For ES6 modules (if using import/export)
export default CONFIG;

// OR for regular scripts (if using <script src="">)
// window.CONFIG = CONFIG;
