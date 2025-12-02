async function loadLiveMatches() {
    try {
        const backendURL = window.CONFIG?.BACKEND_URL || 'https://football-ai-backend-odhw.onrender.com';
        const response = await fetch(`${backendURL}/api/live-matches`);
        const data = await response.json();
        
        displayLiveMatches(data.live_matches);
    } catch (error) {
        console.error('Error loading live matches:', error);
        // Show demo data as fallback
        displayDemoMatches();
    }
}

function displayLiveMatches(matches) {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    
    container.innerHTML = matches.map(match => `
        <div class="match-card">
            <div class="teams">
                <span class="home-team">${match.home_team}</span>
                <span class="vs">VS</span>
                <span class="away-team">${match.away_team}</span>
            </div>
            <div class="match-details">
                <div class="score">${match.score}</div>
                <div class="minute">${match.minute}'</div>
                <div class="status">${match.status}</div>
            </div>
        </div>
    `).join('');
}

function displayDemoMatches() {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="match-card">
            <div class="teams">
                <span class="home-team">Arsenal</span>
                <span class="vs">VS</span>
                <span class="away-team">Chelsea</span>
            </div>
            <div class="match-details">
                <div class="score">2-1</div>
                <div class="minute">65'</div>
                <div class="status">LIVE</div>
            </div>
        </div>
    `;
}

// Update your initializeApp function:
function initializeApp() {
    checkBackendConnection();
    loadInitialPredictions();
    loadLiveMatches(); // Add this line
          }
  
