// Configuration for FootPredict AI
window.CONFIG = {
    // Update this with your actual backend URL after deployment
    BACKEND_URL: 'https://your-backend-url.onrender.com',
    
    // Features
    FEATURES: {
        AI_PREDICTIONS: true,
        LIVE_UPDATES: true,
        LEAGUE_STANDINGS: true
    },
    
    // Update intervals in milliseconds
    INTERVALS: {
        LIVE_MATCHES: 30000,    // 30 seconds
        PREDICTIONS: 600000     // 10 minutes
    }
};

console.log('FootPredict AI Config loaded');
