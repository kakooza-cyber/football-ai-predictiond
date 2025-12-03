console.log('leagues.js loaded successfully!');
console.log('Looking for leagues-container:', document.getElementById('leagues-container'));
console.log('Looking for teams-display-container:', document.getElementById('teams-display-container'));
// --- Configuration ---
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';
const LEAGUES_ENDPOINT = `${RENDER_BASE_URL}/api/leagues`;
const TEAMS_ENDPOINT = `${RENDER_BASE_URL}/api/teams/${leagueName}`;



// DOM elements
const leaguesContainer = document.getElementById('leagues-container');
const teamsContainer = document.getElementById('teams-display-container');

// --- 1. Fetching Functions ---

/**
 * Fetches the list of all available leagues.
 */
async function getLeagues() {
    // ... (Use the fetch logic defined previously)
    const endpoint = `${RENDER_BASE_URL}/api/leagues`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return await response.json(); 
    } catch (error) {
        console.error('Error fetching leagues:', error.message);
        return null;
    }
}

/**
 * Fetches teams for a specific league.
 * @param {string} leagueName - The name of the league.
 */
async function getTeamsByLeague(leagueName) {
    // ... (Use the fetch logic defined previously)
    const encodedLeague = encodeURIComponent(leagueName); 
    const endpoint = `${RENDER_BASE_URL}/api/teams/${encodedLeague}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        return await response.json(); 
    } catch (error) {
        console.error(`Error fetching teams for ${leagueName}:`, error.message);
        return null;
    }
}


// --- 2. Display Functions ---

/**
 * Renders the list of fetched leagues onto the HTML page using the card structure.
 * * @param {Array<Object>} leagues - An array of league objects from the API.
 */
function displayLeagues(leagues) {
    if (!leaguesContainer) return;

    if (!leagues || leagues.length === 0) {
        leaguesContainer.innerHTML = '<p>No leagues found at this time.</p>';
        return;
    }

    leaguesContainer.innerHTML = leagues.map(league => {
        // NOTE: The keys (name, country, teams_count) MUST match your backend's JSON structure!
        const name = league.name || 'Unknown League';
        const logo = name.substring(0, 2).toUpperCase(); // Simple logo generation
        const country = league.country || 'N/A';
        const teamCount = league.teams_count || '??';
        const season = league.season || 'N/A';
        
        return `
            <div class="card">
                <div class="league-card">
                    <div class="league-logo">${logo}</div>
                    <div class="league-info">
                        <div class="league-name">${name}</div>
                        <div class="league-details">
                            <div class="league-detail">${country}</div>
                            <div class="league-detail">${teamCount} Teams</div>
                            <div class="league-detail">${season} Season</div>
                        </div>
                        <button class="view-league-btn" data-league-name="${name}">View Teams</button>
                    </div>
                    <div class="league-stats">
                        <div class="stat-value">${league.matches_count || 0}</div>
                        <div class="stat-label">Matches</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    teamsContainer.innerHTML = '<p>Select a league above to see its teams.</p>'; 
    
    // Attach event listeners to the dynamically created buttons
    leaguesContainer.querySelectorAll('.view-league-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const league = e.target.dataset.leagueName;
            loadTeamsForLeague(league);
        });
    });
}


/**
 * Renders the list of teams for a selected league.
 */
function displayTeams(leagueName, teams) {
    if (!teamsContainer) return;

    if (!teams || teams.length === 0) {
        teamsContainer.innerHTML = `<h3>Teams in ${leagueName}</h3><p>No teams found for prediction data.</p>`;
        return;
    }

    // Displays teams in a simple list format
    teamsContainer.innerHTML = `
        <h3 class="section-subtitle">Teams in ${leagueName} (${teams.length})</h3>
        <div class="teams-list-grid">
            ${teams.map(team => `
                <div class="team-list-item">
                    ${team.name || team}
                </div>
            `).join('')}
        </div>
    `;
}


// --- 3. Orchestration Function ---

/**
 * Handles the logic of fetching teams after a league button is clicked.
 */
async function loadTeamsForLeague(leagueName) {
    teamsContainer.innerHTML = `<p>Loading teams for <strong>${leagueName}</strong>...</p>`;

    const teams = await getTeamsByLeague(leagueName);
    
    if (teams) {
        displayTeams(leagueName, teams);
    } else {
        teamsContainer.innerHTML = `<p class="error">Failed to load teams for ${leagueName}. Please check backend logs.</p>`;
    }
}




/**
 * Loads the initial list of leagues when the page is ready.
 */
 // --- 4. Initialization ---

async function initializeLeaguesPage() {
    leaguesContainer.innerHTML = '<p>Loading available leagues from backend...</p>';

    const responseData = await getLeagues(); // This gets the whole object: { "leagues": [...] }
    
    // Safely check for the key 'leagues' inside the response object
    const leaguesArray = responseData ? responseData.leagues : null; 
    
    if (leaguesArray) {
        // Pass only the array to the display function
        displayLeagues(leaguesArray); 
    } else {
        leaguesContainer.innerHTML = '<p class="error">Could not connect to backend to load leagues, or data is missing.</p>';
    }
}

    document.addEventListener('DOMContentLoaded', initializeLeaguesPage);      
