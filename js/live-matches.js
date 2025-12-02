// --- Configuration ---
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';
const LIVE_MATCHES_ENDPOINT = `${RENDER_BASE_URL}/api/live-matches`;

// DOM Elements
const container = document.getElementById('live-matches-container');
const refreshButton = document.getElementById('refresh-live'); // Targeting the refresh button

// --- Helper Function: Fetches Data ---

/**
 * Loads live match data from the Render backend.
 */
async function fetchLiveMatches() {
    try {
        const response = await fetch(LIVE_MATCHES_ENDPOINT, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const matchesArray = data.live_matches || data; // Flexible response handling
        
        return matchesArray;
        
    } catch (error) {
        console.error('Error fetching live matches:', error);
        return null; // Return null on failure
    }
}

// --- Helper Function: Renders HTML ---

/**
 * Creates the HTML for a single live match card.
 * * @param {Object} match - A single live match object from the API.
 */
function createMatchCardHTML(match) {
    // NOTE: Match the keys (home_team, score, minute, events) to your backend's JSON structure!
    const homeTeam = match.home_team || 'Home';
    const awayTeam = match.away_team || 'Away';
    const score = match.score || '0 - 0';
    const minute = match.minute || 'HT';
    const events = match.events || []; // Assuming an array of events
    
    // Function to render match events (e.g., goals)
    const eventsHTML = events.map(event => 
        // Assuming event objects have 'type', 'minute', and 'player' keys
        `<div class="event ${event.type.toLowerCase()}">
            ⚽ ${event.minute}' ${event.player}
        </div>`
    ).join('');

    return `
        <div class="card live-match">
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
                <div class="live-badge">
                    <span>● LIVE ${minute}'</span>
                </div>
            </div>

            <div class="match-status">
                <div class="score">${score}</div>
            </div>

            <div class="match-events">
                ${eventsHTML}
            </div>
        </div>
    `;
}

/**
 * Renders the fetched live matches onto the page, or displays demo data on error.
 */
async function loadAndDisplayLiveMatches() {
    if (!container) return;
    
    // Show loading state
    container.innerHTML = '<p>Loading live match data...</p>';
    if (refreshButton) refreshButton.disabled = true;

    const matches = await fetchLiveMatches();
    
    if (matches && matches.length > 0) {
        // Render all fetched cards
        const cardsHTML = matches.map(createMatchCardHTML).join('');
        container.innerHTML = cardsHTML;
        console.log(`Successfully loaded ${matches.length} live matches.`);
    } else {
        // Fallback to demo data
        displayDemoMatches();
    }
    
    if (refreshButton) refreshButton.disabled = false;
}

/**
 * Displays fallback demo data when the API fails to connect or load.
 */
function displayDemoMatches() {
    if (!container) return;
    
    container.innerHTML = `
        <p class="error-message">Could not connect to the live match feed. Displaying demo data:</p>
        ${createMatchCardHTML({
            home_team: 'Demo United',
            away_team: 'Test City',
            score: '0 - 0',
            minute: '45',
            events: [{ type: 'Goal', minute: 15, player: 'User' }]
        })}
    `;
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayLiveMatches();
    
    // Set up refresh button handler
    if (refreshButton) {
        refreshButton.addEventListener('click', loadAndDisplayLiveMatches);
    }
});
  
