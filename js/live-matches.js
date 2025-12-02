// ==============================================
// LIVE MATCHES PAGE LOGIC
// ==============================================

let refreshInterval = null;
let isRefreshing = false;

// ==============================================
// MAIN FUNCTION: LOAD LIVE MATCHES
// ==============================================
async function loadLiveMatches(forceRefresh = false) {
    if (isRefreshing) return;
    
    isRefreshing = true;
    const container = document.getElementById('live-matches-container');
    
    // Show loading state
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading live matches...</p>
            </div>
        `;
    }
    
    try {
        console.log('Loading live matches...');
        const data = await window.apiService.getLiveMatches(forceRefresh);
        
        // Handle different response formats
        const matches = data.live_matches || data.matches || data;
        
        if (!matches || matches.length === 0) {
            displayNoMatches();
        } else {
            displayLiveMatches(matches);
        }
        
        // Update last refreshed time
        updateLastRefreshedTime();
        
    } catch (error) {
        console.error('Error loading live matches:', error);
        
        // Show error state
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <span>⚠️</span>
                    <h3>Connection Error</h3>
                    <p>${error.message}</p>
                    <div class="button-group">
                        <button onclick="retryLoadMatches()" class="retry-btn">
                            🔄 Retry
                        </button>
                        <button onclick="showDemoMatches()" class="demo-btn">
                            🎮 Show Demo
                        </button>
                    </div>
                </div>
            `;
        }
    } finally {
        isRefreshing = false;
    }
}

// ==============================================
// DISPLAY FUNCTIONS
// ==============================================
function displayLiveMatches(matches) {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    matches.forEach(match => {
        const matchCard = createMatchCard(match);
        container.appendChild(matchCard);
    });
    
    console.log(`✓ Displayed ${matches.length} matches`);
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Extract match data (handle different formats)
    const homeTeam = match.home_team || match.homeTeam || match.team1 || 'Home Team';
    const awayTeam = match.away_team || match.awayTeam || match.team2 || 'Away Team';
    const score = match.score || '0-0';
    const minute = match.minute || match.time || '0';
    const status = match.status || 'UPCOMING';
    const league = match.league || match.competition || 'Football League';
    const matchId = match.id || match.match_id || Math.random();
    
    // Generate team codes for flags
    const homeCode = getTeamCode(homeTeam);
    const awayCode = getTeamCode(awayTeam);
    
    card.innerHTML = `
        <div class="match-header">
            <span class="match-league">${league}</span>
            <span class="match-status status-${status.toLowerCase()}">${status}</span>
        </div>
        
        <div class="teams">
            <div class="team home-team">
                <div class="team-name">${homeTeam}</div>
                <div class="team-logo">
                    <img src="flags/${homeCode}.png" alt="${homeTeam}" 
                         onerror="this.onerror=null; this.src='flags/default.png';">
                </div>
            </div>
            
            <div class="match-center">
                <div class="score">${score}</div>
                <div class="vs">VS</div>
                ${minute ? `<div class="minute">${minute}'</div>` : ''}
            </div>
            
            <div class="team away-team">
                <div class="team-logo">
                    <img src="flags/${awayCode}.png" alt="${awayTeam}"
                         onerror="this.onerror=null; this.src='flags/default.png';">
                </div>
                <div class="team-name">${awayTeam}</div>
            </div>
        </div>
        
        <div class="match-footer">
            <button class="predict-btn" onclick="predictThisMatch('${homeTeam}', '${awayTeam}', '${league}')">
                🔮 Predict
            </button>
            <button class="details-btn" onclick="showMatchDetails(${matchId})">
                📊 Details
            </button>
        </div>
    `;
    
    return card;
}

function getTeamCode(teamName) {
    const teamMap = {
        'Arsenal': 'ARS', 'Chelsea': 'CHE', 'Manchester United': 'MUN',
        'Liverpool': 'LIV', 'Manchester City': 'MCI', 'Tottenham': 'TOT',
        'Real Madrid': 'RMA', 'Barcelona': 'BAR', 'Atletico Madrid': 'ATM',
        'AC Milan': 'MIL', 'Inter Milan': 'INT', 'Juventus': 'JUV',
        'Bayern Munich': 'BAY', 'Borussia Dortmund': 'DOR', 'PSG': 'PSG'
    };
    
    return teamMap[teamName] || teamName.substring(0, 3).toUpperCase();
}

function displayNoMatches() {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="no-matches">
            <div class="empty-state">
                <span>⚽</span>
                <h3>No Live Matches</h3>
                <p>There are currently no live matches.</p>
                <p>Check back later or try another league.</p>
            </div>
        </div>
    `;
}

function showDemoMatches() {
    console.log('Showing demo matches');
    const demoMatches = window.CONFIG?.DEMO_MATCHES || [
        {
            home_team: 'Arsenal',
            away_team: 'Chelsea',
            league: 'Premier League',
            score: '2-1',
            minute: '65',
            status: 'LIVE'
        }
    ];
    
    displayLiveMatches(demoMatches);
}

// ==============================================
// AUTO-REFRESH FUNCTIONS
// ==============================================
function startAutoRefresh(interval = 30000) {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        if (document.visibilityState === 'visible' && !isRefreshing) {
            console.log('Auto-refreshing live matches...');
            loadLiveMatches(true);
        }
    }, interval);
    
    console.log(`✓ Auto-refresh started (every ${interval/1000}s)`);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log('✗ Auto-refresh stopped');
    }
}

function updateLastRefreshedTime() {
    const element = document.getElementById('last-refreshed');
    if (element) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        element.textContent = `Last updated: ${timeString}`;
    }
}

// ==============================================
// EVENT HANDLERS
// ==============================================
function setupLiveMatchesEvents() {
    // Refresh button
    const refreshBtn = document.getElementById('refresh-matches');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('Manual refresh triggered');
            loadLiveMatches(true);
        });
    }
    
    // Page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            loadLiveMatches(true);
        }
    });
    
    // Network status
    window.addEventListener('online', () => {
        console.log('Network back online, refreshing...');
        loadLiveMatches(true);
    });
    
    window.addEventListener('offline', () => {
        console.log('Network offline');
        stopAutoRefresh();
    });
}

// ==============================================
// GLOBAL FUNCTIONS (accessible from HTML)
// ==============================================
window.retryLoadMatches = function() {
    loadLiveMatches(true);
};

window.showDemoMatches = showDemoMatches;

window.predictThisMatch = function(homeTeam, awayTeam, league) {
    console.log(`Predicting: ${homeTeam} vs ${awayTeam}`);
    
    // Store in localStorage and redirect to predictions page
    localStorage.setItem('predictionData', JSON.stringify({
        home_team: homeTeam,
        away_team: awayTeam,
        league: league
    }));
    
    window.location.href = 'predictions.html';
};

window.showMatchDetails = function(matchId) {
    console.log('Showing details for match:', matchId);
    alert(`Match details for ID: ${matchId}\nFeature coming soon!`);
};

// ==============================================
// INITIALIZATION
// ==============================================
function initializeLiveMatchesPage() {
    console.log('Initializing live matches page...');
    
    // Check if we're on the live-matches page
    if (!document.getElementById('live-matches-container')) {
        console.log('Not on live matches page');
        return;
    }
    
    // Setup events
    setupLiveMatchesEvents();
    
    // Load matches
    loadLiveMatches();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Check backend connection
    checkBackendConnection();
    
    console.log('✓ Live matches page initialized');
}

// Check backend connection
async function checkBackendConnection() {
    try {
        const health = await window.apiService.checkHealth();
        console.log('✓ Backend is healthy:', health);
        
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.className = 'status-indicator connected';
            indicator.textContent = '✅ Connected';
            indicator.title = `Backend: ${window.apiService.baseUrl}`;
        }
    } catch (error) {
        console.warn('✗ Backend connection failed:', error.message);
        
        const indicator = document.getElementById('connection-status');
        if (indicator) {
            indicator.className = 'status-indicator disconnected';
            indicator.textContent = '❌ Disconnected';
            indicator.title = `Error: ${error.message}`;
        }
    }
}

// ==============================================
// START WHEN PAGE LOADS
// ==============================================
document.addEventListener('DOMContentLoaded', initializeLiveMatchesPage);
