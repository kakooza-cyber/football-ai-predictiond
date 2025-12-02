// Global constant for your backend URL
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';

// DOM element where the matches will be displayed
const container = document.getElementById('live-matches-container');

// --- 1. Fetching Function ---

/**
 * Loads live match data from the Render backend.
 */
async function loadLiveMatches() {
    try {
        // Construct the full endpoint URL
        const endpoint = `${RENDER_BASE_URL}/api/live-matches`;
        
        // Show a loading state immediately
        if (container) {
            container.innerHTML = '<p>Loading live match data...</p>';
        }

        const response = await fetch(endpoint);
        
        // Check for HTTP errors (400, 500, etc.)
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Check if the backend response contains the array directly, or inside a key
        // We'll try to find the array robustly. Adjust this line if needed.
        const matchesArray = data.live_matches || data; 

        if (matchesArray && matchesArray.length > 0) {
            displayLiveMatches(matchesArray);
        } else {
            // Handle case where API returns success but no matches
            container.innerHTML = '<p>No live matches are currently available.</p>';
        }
        
    } catch (error) {
        console.error('Error loading live matches:', error);
        // Fallback to display demo data on error
        displayDemoMatches();
    }
}


// --- 2. Display Functions ---

/**
 * Renders the fetched live matches onto the page.
 * @param {Array<Object>} matches - An array of match objects from the API.
 */
function displayLiveMatches(matches) {
    if (!container) return;
    
    // Generate HTML for all matches
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="teams">
                <span class="home-team">${match.home_team}</span>
                <span class="vs">VS</span>
                <span class="away-team">${match.away_team}</span>
            </div>
            <div class="match-details">
                <div class="score">${match.score || '0-0'}</div>
                <div class="minute">${match.minute}'</div>
                <div class="status">${match.status || 'Scheduled'}</div>
            </div>
        </div>
    `).join('');
}


/**
 * Displays fallback demo data when the API fails to connect or load.
 */
function displayDemoMatches() {
    if (!container) return;
    
    container.innerHTML = `
        <p class="error-message">Could not connect to the live match feed. Displaying demo data:</p>
        <div class="match-card demo-match">
            <div class="teams">
                <span class="home-team">Manchester City</span>
                <span class="vs">VS</span>
                <span class="away-team">Liverpool</span>
            </div>
            <div class="match-details">
                <div class="score">1-1</div>
                <div class="minute">75'</div>
                <div class="status">LIVE</div>
            </div>
        </div>
    `;
}


// --- 3. Initialization ---

// Start the loading process when the HTML document is fully loaded
document.addEventListener('DOMContentLoaded', loadLiveMatches);
  
