                            
// Ensure these functions (getLeagues, getTeamsByLeague, postPrediction) 
// are available globally, usually by being defined in a linked api.js file.

// Global variables to hold data and DOM elements
const leagueSelect = document.getElementById('league-select');
const teamASelect = document.getElementById('team-a-select');
const teamBSelect = document.getElementById('team-b-select');
const predictButton = document.getElementById('predict-button');
const resultDisplay = document.getElementById('prediction-result');


// --- 1. CORE API CALL HANDLERS ---

/**
 * Loads the list of leagues from the backend and populates the league dropdown.
 */
async function loadLeagues() {
    try {
        // This function is defined in your API file (e.g., api.js)
        const leagues = await getLeagues(); 
        
        if (leagues && leagues.length > 0) {
            // Add a default prompt option
            leagueSelect.innerHTML = '<option value="">Select a League</option>';
            
            leagues.forEach(league => {
                // Assuming the backend returns an array of league names (strings)
                const option = document.createElement('option');
                option.value = league;
                option.textContent = league;
                leagueSelect.appendChild(option);
            });
            console.log('Leagues loaded successfully.');
        } else {
            console.warn('No leagues returned from the backend.');
        }
    } catch (error) {
        console.error('Failed to load leagues:', error);
        resultDisplay.textContent = 'Error loading leagues. Please try again later.';
    }
}


/**
 * Loads teams for the currently selected league and populates the team dropdowns.
 * @param {string} leagueName - The name of the league selected by the user.
 */
async function loadTeams(leagueName) {
    // Clear previous teams and disable selection while loading
    teamASelect.innerHTML = '<option value="">Loading Teams...</option>';
    teamBSelect.innerHTML = '<option value="">Loading Teams...</option>';
    teamASelect.disabled = true;
    teamBSelect.disabled = true;

    try {
        // This function is defined in your API file (e.g., api.js)
        const teams = await getTeamsByLeague(leagueName); 
        
        if (teams && teams.length > 0) {
            // Re-enable and populate
            teamASelect.innerHTML = '<option value="">Select Home Team</option>';
            teamBSelect.innerHTML = '<option value="">Select Away Team</option>';

            teams.forEach(team => {
                // Assuming the backend returns an array of team names (strings)
                const optionA = document.createElement('option');
                optionA.value = team;
                optionA.textContent = team;
                teamASelect.appendChild(optionA);

                const optionB = document.createElement('option');
                optionB.value = team;
                optionB.textContent = team;
                teamBSelect.appendChild(optionB);
            });
            
            teamASelect.disabled = false;
            teamBSelect.disabled = false;
            console.log(`Teams for ${leagueName} loaded.`);
        } else {
            teamASelect.innerHTML = '<option value="">No Teams Found</option>';
            teamBSelect.innerHTML = '<option value="">No Teams Found</option>';
            console.warn(`No teams found for league: ${leagueName}`);
        }
    } catch (error) {
        console.error(`Failed to load teams for ${leagueName}:`, error);
        resultDisplay.textContent = 'Error loading teams. Check console for details.';
    }
}


/**
 * Collects user input and sends a prediction request to the backend.
 */
async function requestPrediction() {
    // 1. Collect Data
    const homeTeam = teamASelect.value;
    const awayTeam = teamBSelect.value;
    const league = leagueSelect.value;
    
    // 2. Simple Validation (Add more detailed checks as needed)
    if (!league || !homeTeam || !awayTeam) {
        alert('Please select a league, a home team, and an away team.');
        return;
    }
    if (homeTeam === awayTeam) {
        alert('Home Team and Away Team cannot be the same!');
        return;
    }
    
    // 3. Prepare the payload (add any other required fields for your API)
    const predictionData = {
        league: league,
        home_team: homeTeam,
        away_team: awayTeam,
        // Add other required inputs here (e.g., past form, stadium, etc.)
    };

    // 4. Send Request and Handle Response
    predictButton.disabled = true;
    predictButton.textContent = 'Predicting...';
    resultDisplay.textContent = 'Calculating prediction...';

    try {
        // This function is defined in your API file (e.g., api.js)
        const result = await postPrediction(predictionData); 

        if (result && result.prediction) {
            // Assuming the result object has a key like 'prediction'
            resultDisplay.innerHTML = `
                <h2>Prediction Result</h2>
                <p>Match: <strong>${homeTeam} vs ${awayTeam}</strong></p>
                <p>Winner: <strong>${result.prediction}</strong></p>
                `;
        } else {
            resultDisplay.textContent = 'Prediction failed or returned no data.';
        }
    } catch (error) {
        console.error('Prediction request failed:', error);
        resultDisplay.textContent = 'An error occurred while requesting the prediction. See console.';
    } finally {
        predictButton.disabled = false;
        predictButton.textContent = 'Get Prediction';
    }
}


// --- 2. INITIALIZATION AND EVENT LISTENERS ---

/**
 * Sets up all necessary event listeners and loads initial data.
 */
function initializePredictionPage() {
    // A. Load initial data (Leagues)
    loadLeagues();

    // B. Set up event listeners

    // When the user selects a league, load the teams for that league
    if (leagueSelect) {
        leagueSelect.addEventListener('change', (e) => {
            const selectedLeague = e.target.value;
            if (selectedLeague) {
                loadTeams(selectedLeague);
            } else {
                // Clear teams if "Select a League" is chosen
                teamASelect.innerHTML = '<option value="">Select Team</option>';
                teamBSelect.innerHTML = '<option value="">Select Team</option>';
            }
        });
    }

    // When the user clicks the Predict button
    if (predictButton) {
        predictButton.addEventListener('click', requestPrediction);
    }
}

// Ensure the setup runs only after the entire HTML document is loaded
document.addEventListener('DOMContentLoaded', initializePredictionPage);
        
