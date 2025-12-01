// File: js/live-matches.js
import CONFIG from './config.js';
import './api-service.js';

async function loadLiveMatches() {
      

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
        // Use the API service
        const data = await apiService.getLiveMatches(forceRefresh);
        
        // Check data structure
        const matches = data.live_matches || data.matches || data;
        
        if (!matches || matches.length === 0) {
            displayNoMatches();
            return;
        }
        
        displayLiveMatches(matches);
        
        // Update last refreshed time
        updateLastRefreshedTime();
        
    } catch (error) {
        console.error('Error loading live matches:', error);
        
        // Show error state
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <span>⚠️</span>
                    <h3>Failed to load matches</h3>
                    <p>${error.message}</p>
                    <button onclick="retryLoadMatches()" class="retry-btn">Retry</button>
                    <button onclick="showDemoMatches()" class="demo-btn">Show Demo</button>
                </div>
            `;
        }
    }
}

// Improved display function
function displayLiveMatches(matches) {
    const container = document.getElementById('live-matches-container');
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Create match cards
    matches.forEach(match => {
        const matchCard = createMatchCard(match);
        container.appendChild(matchCard);
    });
}

function createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    // Handle different data structures
    const homeTeam = match.home_team || match.homeTeam || match.team1;
    const awayTeam = match.away_team || match.awayTeam || match.team2;
    const score = match.score || `${match.home_score || 0}-${match.away_score || 0}`;
    const minute = match.minute || match.time_elapsed || '0';
    const status = match.status || 'LIVE';
    const league = match.league || match.competition;
    
    card.innerHTML = `
        <div class="match-header">
            ${league ? `<span class="match-league">${league}</span>` : ''}
            <span class="match-status ${status.toLowerCase()}">${status}</span>
        </div>
        <div class="teams">
            <div class="team home-team">
                <span class="team-name">${homeTeam}</span>
                <span class="team-logo">
                    <img src="flags/${getTeamCode(homeTeam)}.png" alt="${homeTeam}" onerror="this.style.display='none'">
                </span>
            </div>
            <div class="match-center">
                <div class="score">${score}</div>
                <div class="vs">VS</div>
                ${minute ? `<div class="minute">${minute}'</div>` : ''}
            </div>
            <div class="team away-team">
                <span class="team-logo">
                    <img src="flags/${getTeamCode(awayTeam)}.png" alt="${awayTeam}" onerror="this.style.display='none'">
                </span>
                <span class="team-name">${awayTeam}</span>
            </div>
        </div>
        <div class="match-footer">
            <button class="predict-btn" onclick="predictMatch('${homeTeam}', '${awayTeam}')">
                Predict
            </button>
            <button class="details-btn" onclick="showMatchDetails('${match.id || ''}')">
                Details
            </button>
        </div>
    `;
    
    return card;
}

// Helper function for team codes
function getTeamCode(teamName) {
    const teamMap = {
        'Arsenal': 'ARS',
        'Chelsea': 'CHE',
        'Manchester United': 'MUN',
        'Liverpool': 'LIV',
        // Add more mappings
    };
    return teamMap[teamName] || teamName.substring(0, 3).toUpperCase();
}

// Auto-refresh functionality
function startAutoRefresh(interval = 30000) { // 30 seconds
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    
    refreshInterval = setInterval(() => {
        if (!isRefreshing && document.visibilityState === 'visible') {
            loadLiveMatches(true);
        }
    }, interval);
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
    }
      }
}

// Page-specific initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('Live matches page loaded');
    loadLiveMatches();
    startAutoRefresh();
});
