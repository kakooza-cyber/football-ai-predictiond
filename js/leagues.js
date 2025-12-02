// Global constant for your backend URL
const RENDER_BASE_URL = 'https://football-ai-backend-odhw.onrender.com';

// DOM elements
const leaguesContainer = document.getElementById('leagues-list-container');
const teamsContainer = document.getElementById('teams-display-container');

// --- 1. Fetching Functions (Using the same logic as your API functions) ---

/**
 * Fetches the list of all available leagues.
 */
async function getLeagues() {
    const endpoint = `${RENDER_BASE_URL}/api/leagues`;
    
    try {
        const response = await fetch(endpoint, { method: 'GET' });
        
        if (!response.ok) {
            throw new Error(`Failed to fetch leagues. Status: ${response.status}`);
        }

        const leagues = await response.json();
        // Assuming the response is an array of league strings/objects
        return leagues; 
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
    const encodedLeague = encodeURIComponent(leagueName); 
    const endpoint = `${RENDER_BASE_URL}/api/teams/${encodedLeague}`;

    try {
        const response = await fetch(endpoint, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Failed to fetch teams for ${leagueName}. Status: ${response.status}`);
        }

        const teams = await response.json();
        return teams; // This will be an array/list of team names or objects

    } catch (error) {
        console.error(`Error fetching teams for ${leagueName}:`, error.message);
        return null;
    }
}


// --- 2. Display Functions ---

/**
 * Renders the list of fetched leagues onto the HTML page.
 * @param {Array<string>} leagues - An array of league names.
 */
function displayLeagues(leagues) {
    if (!leaguesContainer) return;

    if (!leagues || leagues.length === 0) {
        leaguesContainer.innerHTML = '<p>No leagues found at this time.</p>';
        return;
    }

    leaguesContainer.innerHTML = leagues.map(league => `
        <button class="league-button" data-league-name="${league}">
            ${league}
        </button>
    `).join('');
    
    // Clear previous team display
    teamsContainer.innerHTML = ''; 
    
    // Attach event listeners to the new buttons
    leaguesContainer.querySelectorAll('.league-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const league = e.target.dataset.leagueName;
            loadTeamsForLeague(league);
        });
    });
}


/**
 * Renders the list of teams for a selected league.
 * @param {string} leagueName - The name of the selected league.
 * @param {Array<string>} teams - An array of team names.
 */
function displayTeams(leagueName, teams) {
    if (!teamsContainer) return;

    if (!teams || teams.length === 0) {
        teamsContainer.innerHTML = `<h3>Teams in ${leagueName}</h3><p>No teams found.</p>`;
        return;
    }

    teamsContainer.innerHTML = `
        <h3>Teams in ${leagueName} (${teams.length})</h3>
        <ul>
            ${teams.map(team => `<li>${team}</li>`).join('')}
        </ul>
    `;
}


// --- 3. Orchestration Function ---

/**
 * Handles the logic of fetching teams after a league button is clicked.
 * @param {string} leagueName - The name of the league to fetch teams for.
 */
async function loadTeamsForLeague(leagueName) {
    teamsContainer.innerHTML = `<p>Loading teams for <strong>${leagueName}</strong>...</p>`;

    const teams = await getTeamsByLeague(leagueName);
    
    if (teams) {
        displayTeams(leagueName, teams);
    } else {
        teamsContainer.innerHTML = `<p class="error">Failed to load teams for ${leagueName}.</p>`;
    }
}


// --- 4. Initialization ---

/**
 * Loads the initial list of leagues when the page is ready.
 */
async function initializeLeaguesPage() {
    leaguesContainer.innerHTML = '<p>Loading available leagues...</p>';

    const leagues = await getLeagues();
    
    if (leagues) {
        displayLeagues(leagues);
    } else {
        leaguesContainer.innerHTML = '<p class="error">Could not connect to backend to load leagues.</p>';
    }
}


// Start the application when the page is fully loaded
document.addEventListener('DOMContentLoaded', initializeLeaguesPage);
                                                
