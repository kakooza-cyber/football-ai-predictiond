// Function to check the backend's health status
async function checkBackendHealth() {
    const endpoint = `${RENDER_BASE_URL}/health`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
        });

        if (response.ok) {
            console.log('Backend is running and healthy!');
            // You can optionally parse the response text if the backend sends a message
            const data = await response.text(); 
            return data;
        } else {
            console.error('Backend returned an unhealthy status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Network or CORS error during health check:', error);
        return null;
    }
}
// Function to request a match prediction
async function postPrediction(predictionRequestData) {
    const endpoint = `${RENDER_BASE_URL}/api/predict`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            // CRITICAL: Must specify content type for POST requests with JSON
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(predictionRequestData) // The data must be converted to a JSON string
        });

        if (!response.ok) {
            // This handles HTTP errors like 400, 500, etc.
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Prediction Result:', result);
        return result;

    } catch (error) {
        console.error('Error during prediction request:', error.message);
        // Handle Validation Errors, Network Errors, etc. here
        return null;
    }
}

/* // --- Example Usage ---
const samplePredictionData = {
    team_a: "Real Madrid",
    team_b: "FC Barcelona",
    // ... other required data based on your PredictionRequest schema
};

postPrediction(samplePredictionData).then(result => {
    if (result) {
        // Update your predictions.html page with the result
    }
});
*/
      // Function to get a list of current live matches
async function getLiveMatches() {
    const endpoint = `${RENDER_BASE_URL}/api/live-matches`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch live matches. Status: ${response.status}`);
        }

        const matches = await response.json();
        console.log('Live Matches:', matches);
        return matches; // This will be an array or list of match objects

    } catch (error) {
        console.error('Error fetching live matches:', error.message);
        return [];
    }
    }
    // Function to get a list of available leagues
async function getLeagues() {
    const endpoint = `${RENDER_BASE_URL}/api/leagues`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch leagues. Status: ${response.status}`);
        }

        const leagues = await response.json();
        console.log('Available Leagues:', leagues);
        return leagues; // This will be an array/list of league names or objects

    } catch (error) {
        console.error('Error fetching leagues:', error.message);
        return [];
    }
    }
// Function to get teams belonging to a specific league
async function getTeamsByLeague(leagueName) {
    // 1. Sanitize the league name (e.g., URL encoding for safety)
    const encodedLeague = encodeURIComponent(leagueName); 
    
    // 2. Insert the league name into the URL
    const endpoint = `${RENDER_BASE_URL}/api/teams/${encodedLeague}`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch teams for ${leagueName}. Status: ${response.status}`);
        }

        const teams = await response.json();
        console.log(`Teams in ${leagueName}:`, teams);
        return teams; // This will be an array/list of team names or objects

    } catch (error) {
        console.error(`Error fetching teams for ${leagueName}:`, error.message);
        return [];
    }
}

// --- Example Usage ---
// getTeamsByLeague('Premier League');

  
