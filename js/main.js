// Football Predictions Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('FootPredict AI loaded successfully!');
    
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Check if backend is available
    checkBackendConnection();
    
    // Load initial predictions
    loadInitialPredictions();
}

async function checkBackendConnection() {
    try {
        const backendURL = window.CONFIG?.BACKEND_URL || 'https://football-ai-backend-odhw.onrender.com';
        const response = await fetch(`${backendURL}/health`);
        
        if (response.ok) {
            console.log('✅ Backend connection successful');
        } else {
            console.log('⚠️ Backend connection issues');
        }
    } catch (error) {
        console.log('❌ Backend not available, using demo data');
    }
}

function loadInitialPredictions() {
    // This would be replaced with actual API calls
    console.log('Loading predictions...');
}

// API Service
class FootballAPIService {
    constructor() {
        this.backendURL = window.CONFIG?.BACKEND_URL;
    }
    
    async getPrediction(homeTeam, awayTeam, league) {
        try {
            const response = await fetch(`${this.backendURL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    home_team: homeTeam,
                    away_team: awayTeam,
                    league: league
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }
}

window.footballAPI = new FootballAPIService();
