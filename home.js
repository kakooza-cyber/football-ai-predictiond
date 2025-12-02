// --- Configuration ---
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';
const PREDICTIONS_ENDPOINT = `${RENDER_BASE_URL}/api/today-predictions`; // Reusing the same endpoint

// DOM Element
const predictionsContainer = document.getElementById('top-predictions-container');


// --- Fetching and Displaying Logic ---

/**
 * Fetches today's predictions and displays only the top 1 or 2 on the homepage.
 */
async function loadTopPredictions() {
    if (!predictionsContainer) return;
    
    try {
        const response = await fetch(PREDICTIONS_ENDPOINT, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const predictions = data.predictions || data; 
        
        // We only show the first 1 or 2 predictions for the homepage
        const topPredictions = predictions.slice(0, 2); 

        if (topPredictions && topPredictions.length > 0) {
            const cardsHTML = topPredictions.map(createHomePredictionCardHTML).join('');
            predictionsContainer.innerHTML = cardsHTML;
        } else {
            predictionsContainer.innerHTML = '<p>No top predictions available today.</p>';
        }

    } catch (error) {
        console.error('Error loading home predictions:', error);
        predictionsContainer.innerHTML = `
            <p class="error-message">Failed to load predictions. Please check backend connection.</p>
        `;
    }
}


/**
 * Creates the simplified HTML card for the homepage display.
 * This is a simplified version of the function in predictions.js.
 */
function createHomePredictionCardHTML(prediction) {
    const homeTeam = prediction.home_team || 'N/A';
    const awayTeam = prediction.away_team || 'N/A';
    const predictedWinner = prediction.winner || 'Draw';
    const expectedGoals = prediction.expected_goals || 'X - X';
    const confidence = prediction.confidence || 50;

    return `
        <div class="card">
            <div class="card-header">
                <div class="match-teams">
                    <div class="team">
                        <div class="team-logo">${homeTeam.substring(0, 3).toUpperCase()}</div>
                        <div class="team-name">${homeTeam}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo">${awayTeam.substring(0, 3).toUpperCase()}</div>
                        <div class="team-name">${awayTeam}</div>
                    </div>
                </div>
                <div class="match-time">${prediction.match_time || 'Today'}</div>
            </div>
            
            <div class="prediction-section">
                <div class="prediction-header">
                    <div class="ai-badge">AI PREDICTION</div>
                    <div class="accuracy">${confidence}% Confidence</div>
                </div>
                <div class="prediction-details">
                    <div class="prediction-item">
                        <div class="prediction-label">Predicted Winner</div>
                        <div class="prediction-value">${predictedWinner}</div>
                    </div>
                    <div class="prediction-item">
                        <div class="prediction-label">Expected Goals</div>
                        <div class="prediction-value">${expectedGoals}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// --- Initialization ---

document.addEventListener('DOMContentLoaded', loadTopPredictions);
                                     
