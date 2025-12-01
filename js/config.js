// ==============================================
// BACKEND CONFIGURATION
// ==============================================

const CONFIG = {
    // Backend URLs
    BACKEND_URL: 'https://football-ai-backend-odhw.onrender.com',
    LOCAL_BACKEND_URL: 'http://localhost:5000',
    
    // Environment
    ENV: 'production', // Change to 'development' when working locally
    
    // API Timeouts
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    
    // API Endpoints
    ENDPOINTS: {
        PREDICT: '/api/predict',
        LIVE_MATCHES: '/api/live-matches',
        LEAGUES: '/api/leagues',
        TEAMS: '/api/teams',
        HEALTH: '/health'
    },
    
    // Cache settings
    CACHE_DURATION: 30000, // 30 seconds
    
    // Demo data for fallback
    DEMO_MATCHES: [
        {
            id: 1,
            home_team: 'Arsenal',
            away_team: 'Chelsea',
            league: 'Premier League',
            score: '2-1',
            minute: '65',
            status: 'LIVE'
        },
        {
            id: 2,
            home_team: 'Real Madrid',
            away_team: 'Barcelona',
            league: 'La Liga',
            score: '1-1',
            minute: '45',
            status: 'HALFTIME'
        },
        {
            id: 3,
            home_team: 'AC Milan',
            away_team: 'Inter Milan',
            league: 'Serie A',
            score: '0-0',
            minute: '30',
            status: 'LIVE'
        }
    ]
};

// Make config available globally
window.CONFIG = CONFIG;

console.log('✓ Config loaded. Environment:', CONFIG.ENV);
