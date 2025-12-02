// ==============================================
// PREDICTIONS PAGE LOGIC
// ==============================================

// ==============================================
// INITIALIZATION
// ==============================================
async function initializePredictionsPage() {
    console.log('Initializing predictions page...');
    
    // Load leagues dropdown
    await loadLeaguesDropdown();
    
    // Setup form
    setupPredictionForm();
    
    // Check for pre-filled data
    checkForPrefilledData();
    
    console.log('✓ Predictions page initialized');
}

// ==============================================
// LOAD DROPDOWNS
// ==============================================
async function loadLeaguesDropdown() {
    const leagueSelect = document.getElementById('league');
    if (!leagueSelect) return;
    
    try {
        const data = await window.apiService.getLeagues();
        const leagues = data.leagues || data;
        
        // Clear existing options except first
        leagueSelect.innerHTML = '<option value="">Select League</option>';
        
        // Add leagues
        leagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueSelect.appendChild(option);
        });
        
        console.log(`✓ Loaded ${leagues.length} leagues`);
    } catch (error) {
        console.error('Failed to load leagues:', error);
        
        // Add default leagues
        const defaultLeagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'];
        defaultLeagues.forEach(league => {
            const option = document.createElement('option');
            option.value = league;
            option.textContent = league;
            leagueSelect.appendChild(option);
        });
    }
}

async function loadTeamsDropdown(league, targetSelectId) {
    const teamSelect = document.getElementById(targetSelectId);
    if (!teamSelect || !league) return;
    
    // Show loading
    teamSelect.innerHTML = '<option value="">Loading teams...</option>';
    teamSelect.disabled = true;
    
    try {
        const data = await window.apiService.getTeams(league);
        const teams = data.teams || data;
        
        // Clear and add teams
        teamSelect.innerHTML = '<option value="">Select Team</option>';
        
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });
        
        teamSelect.disabled = false;
        console.log(`✓ Loaded ${teams.length} teams for ${league}`);
    } catch (error) {
        console.error(`Failed to load teams for ${league}:`, error);
        
        // Add default teams
        const defaultTeams = ['Select Team 1', 'Select Team 2', 'Select Team 3'];
        teamSelect.innerHTML = '<option value="">Select Team</option>';
        defaultTeams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });
        
        teamSelect.disabled = false;
    }
}

// ==============================================
// FORM HANDLING
// ==============================================
function setupPredictionForm() {
    const form = document.getElementById('predictForm');
    const leagueSelect = document.getElementById('league');
    const homeTeamSelect = document.getElementById('homeTeam');
    const awayTeamSelect = document.getElementById('awayTeam');
    
    if (!form) return;
    
    // League change event
    if (leagueSelect) {
        leagueSelect.addEventListener('change', function() {
            const league = this.value;
            if (league) {
                loadTeamsDropdown(league, 'homeTeam');
                loadTeamsDropdown(league, 'awayTeam');
            } else {
                homeTeamSelect.innerHTML = '<option value="">Select Team</option>';
                awayTeamSelect.innerHTML = '<option value="">Select Team</option>';
            }
        });
    }
    
    // Form submit event
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const homeTeam = homeTeamSelect.value;
        const awayTeam = awayTeamSelect.value;
        const league = leagueSelect.value;
        
        if (!homeTeam || !awayTeam || !league) {
            alert('Please select a league and both teams');
            return;
        }
        
        if (homeTeam === awayTeam) {
            alert('Home and away teams cannot be the same');
            return;
        }
        
        await makePrediction(homeTeam, awayTeam, league);
    });
    
    console.log('✓ Prediction form setup complete');
}

// ==============================================
// MAKE PREDICTION
// ==============================================
async function makePrediction(homeTeam, awayTeam, league) {
    const resultContainer = document.getElementById('predictionResult');
    if (!resultContainer) return;
    
    // Show loading
    resultContainer.innerHTML = `
        <div class="prediction-loading">
            <div class="spinner"></div>
            <h3>AI is analyzing the match...</h3>
            <p>${homeTeam} vs ${awayTeam}</p>
        </div>
    `;
    
    try {
        console.log(`Making prediction: ${homeTeam} vs ${awayTeam} (${league})`);
        
        const prediction = await window.apiService.predictMatch({
            home_team: homeTeam,
            away_team: awayTeam,
            league: league
        });
        
        console.log('✓ Prediction received:', prediction);
        displayPrediction(prediction);
        
    } catch (error) {
        console.error('Prediction error:', error);
        
        resultContainer.innerHTML = `
            <div class="prediction-error">
                <span>❌</span>
                <h3>Prediction Failed</h3>
                <p>${error.message}</p>
                <button onclick="retryPrediction()" class="retry-btn">
                    Try Again
                </button>
            </div>
        `;
    }
}

// ==============================================
// DISPLAY PREDICTION
// ==============================================
function displayPrediction(data) {
    const container = document.getElementById('predictionResult');
    if (!container) return;
    
    const match = data.match;
    const prediction = data.prediction;
    const confidence = data.confidence;
    const probabilities = data.probabilities;
    const analysis = data.analysis;
    const timestamp = new Date(data.timestamp).toLocaleString();
    
    // Get confidence color
    const confidenceClass = getConfidenceClass(confidence);
    
    container.innerHTML = `
        <div class="prediction-result">
            <div class="match-header">
                <h2>${match.home_team} vs ${match.away_team}</h2>
                <div class="match-league">${match.league}</div>
            </div>
            
            <div class="main-prediction">
                <div class="prediction-badge ${prediction.toLowerCase().replace(' ', '-')}">
                    ${prediction}
                </div>
                <div class="confidence">
                    Confidence: 
                    <span class="confidence-value ${confidenceClass}">${confidence}%</span>
                </div>
            </div>
            
            <div class="probabilities">
                <h3>Win Probabilities</h3>
                <div class="prob-bars">
                    <div class="prob home-win">
                        <div class="prob-label">${match.home_team} Win</div>
                        <div class="prob-bar-container">
                            <div class="prob-bar" style="width: ${probabilities.home_win}%"></div>
                        </div>
                        <div class="prob-value">${probabilities.home_win}%</div>
                    </div>
                    
                    <div class="prob draw">
                        <div class="prob-label">Draw</div>
                        <div class="prob-bar-container">
                            <div class="prob-bar" style="width: ${probabilities.draw}%"></div>
                        </div>
                        <div class="prob-value">${probabilities.draw}%</div>
                    </div>
                    
                    <div class="prob away-win">
                        <div class="prob-label">${match.away_team} Win</div>
                        <div class="prob-bar-container">
                            <div class="prob-bar" style="width: ${probabilities.away_win}%"></div>
                        </div>
                        <div class="prob-value">${probabilities.away_win}%</div>
                    </div>
                </div>
            </div>
            
            <div class="analysis">
                <h3>Match Analysis</h3>
                
                <div class="stats-grid">
                    <div class="stat">
                        <div class="stat-label">Expected Goals (Home)</div>
                        <div class="stat-value">${analysis.expected_goals_home}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Expected Goals (Away)</div>
                        <div class="stat-value">${analysis.expected_goals_away}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Both Teams Score</div>
                        <div class="stat-value">${analysis.both_teams_score_prob}%</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Over 2.5 Goals</div>
                        <div class="stat-value">${analysis.over_2_5_goals_prob}%</div>
                    </div>
                </div>
                
                <div class="key-factors">
                    <h4>Key Factors:</h4>
                    <ul>
                        ${analysis.key_factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="prediction-footer">
                <div class="timestamp">Generated: ${timestamp}</div>
                <button onclick="sharePrediction()" class="share-btn">📤 Share</button>
            </div>
        </div>
    `;
}

function getConfidenceClass(confidence) {
    if (confidence >= 70) return 'confidence-high';
    if (confidence >= 50) return 'confidence-medium';
    return 'confidence-low';
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================
function checkForPrefilledData() {
    try {
        const storedData = localStorage.getItem('predictionData');
        if (storedData) {
            const data = JSON.parse(storedData);
            
            // Set league
            const leagueSelect = document.getElementById('league');
            if (leagueSelect && data.league) {
                leagueSelect.value = data.league;
                leagueSelect.dispatchEvent(new Event('change'));
                
                // Set teams after a delay
                setTimeout(() => {
                    const homeSelect = document.getElementById('homeTeam');
                    const awaySelect = document.getElementById('awayTeam');
                    
                    if (homeSelect && data.home_team) {
                        homeSelect.value = data.home_team;
                    }
                    if (awaySelect && data.away_team) {
                        awaySelect.value = data.away_team;
                    }
                    
                    // Auto-submit after 1 second
                    setTimeout(() => {
                        const form = document.getElementById('predictForm');
                        if (form) form.dispatchEvent(new Event('submit'));
                    }, 1000);
                    
                }, 500);
                
                // Clear stored data
                localStorage.removeItem('predictionData');
            }
        }
    } catch (error) {
        console.error('Error loading pre-filled data:', error);
    }
}

// ==============================================
// GLOBAL FUNCTIONS
// ==============================================
window.retryPrediction = function() {
    const form = document.getElementById('predictForm');
    if (form) {
        form.dispatchEvent(new Event('submit'));
    }
};

window.sharePrediction = function() {
    const predictionText = document.querySelector('.prediction-result')?.innerText;
    if (predictionText) {
        navigator.clipboard.writeText(predictionText.substring(0, 1000))
            .then(() => alert('Prediction copied to clipboard!'))
            .catch(() => alert('Failed to copy prediction'));
    }
};

// ==============================================
// START WHEN PAGE LOADS
// ==============================================
document.addEventListener('DOMContentLoaded', initializePredictionsPage);
