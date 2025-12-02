// --- Configuration ---
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';
const PREDICTIONS_ENDPOINT = `${RENDER_BASE_URL}/api/today-predictions`;

// DOM Elements
const predictionsContainer = document.getElementById('predictions-container');
const refreshButton = document.getElementById('refresh-predictions');

// --- Helper Function: Fetches Data ---

/**
 * Fetches the list of today's predictions from the backend.
 */
async function fetchTodayPredictions() {
    try {
        const response = await fetch(PREDICTIONS_ENDPOINT, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Assuming the backend returns an array of predictions, either directly 
        // or inside a key like 'predictions'.
        const predictionsArray = data.predictions || data; 
        
        return predictionsArray;

    } catch (error) {
        console.error('Error fetching today\'s predictions:', error);
        return null; // Return null on failure
    }
}


// --- Helper Function: Renders HTML ---

/**
 * Creates the HTML for a single prediction card using your styling structure.
 * * @param {Object} prediction - A single prediction object from the API.
 * * NOTE: The keys here (e.g., home_team, winner, confidence) MUST match 
 * the JSON structure your backend returns for each prediction.
 */
function createPredictionCardHTML(prediction) {
    // Basic checks for required fields (customize based on your API)
    const homeTeam = prediction.home_team || 'N/A';
    const awayTeam = prediction.away_team || 'N/A';
    const predictedWinner = prediction.winner || 'Draw';
    const confidence = prediction.confidence || 50; // Use a percentage number
    const expectedGoals = prediction.expected_goals || 'X - X';
    const bts = prediction.bts_prediction || 'N/A';
    const over25 = prediction.over_25_prediction || 'N/A';
    
    // Convert confidence to a style width
    const confidenceWidth = Math.min(100, Math.max(0, confidence));

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
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: ${confidenceWidth}%"></div>
                        </div>
                    </div>
                    <div class="prediction-item">
                        <div class="prediction-label">Expected Goals</div>
                        <div class="prediction-value">${expectedGoals}</div>
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: 70%"></div> 
                        </div>
                    </div>
                    <div class="prediction-item">
                        <div class="prediction-label">Both Teams Score</div>
                        <div class="prediction-value">${bts}</div>
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: 65%"></div>
                        </div>
                    </div>
                    <div class="prediction-item">
                        <div class="prediction-label">Over 2.5 Goals</div>
                        <div class="prediction-value">${over25}</div>
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: 75%"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// --- Main Logic ---

/**
 * Initializes the prediction page by loading and displaying predictions.
 */
async function loadAndDisplayPredictions() {
    // Show loading state
    if (predictionsContainer) {
        predictionsContainer.innerHTML = '<p>Loading today\'s AI predictions from backend...</p>';
    }
    
    // Disable refresh button during fetch
    if (refreshButton) {
        refreshButton.disabled = true;
    }

    const predictions = await fetchTodayPredictions();

    if (predictions && predictions.length > 0) {
        // Render all fetched cards
        const cardsHTML = predictions.map(createPredictionCardHTML).join('');
        predictionsContainer.innerHTML = cardsHTML;
        console.log(`Successfully loaded ${predictions.length} predictions.`);
    } else {
        // Display a fallback message
        predictionsContainer.innerHTML = `
            <p>No predictions available today or failed to connect to the backend.</p>
            <p>Please try refreshing or check the console for CORS/network errors.</p>
        `;
    }

    if (refreshButton) {
        refreshButton.disabled = false;
    }
}


// --- Initialization and Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayPredictions();
    
    // Set up refresh button handler
    if (refreshButton) {
        refreshButton.addEventListener('click', loadAndDisplayPredictions);
    }
});
  
