// ==============================================
// LEAGUES PAGE LOGIC
// ==============================================

async function initializeLeaguesPage() {
    console.log('Initializing leagues page...');
    
    await loadLeagues();
    
    console.log('✓ Leagues page initialized');
}

async function loadLeagues() {
    const container = document.getElementById('leagues-container');
    if (!container) return;
    
    // Show loading
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading leagues...</p>
        </div>
    `;
    
    try {
        const data = await window.apiService.getLeagues();
        const leagues = data.leagues || data;
        
        displayLeagues(leagues);
    } catch (error) {
        console.error('Failed to load leagues:', error);
        
        container.innerHTML = `
            <div class="error-state">
                <span>⚠️</span>
                <h3>Failed to load leagues</h3>
                <p>${error.message}</p>
                <button onclick="loadLeagues()" class="retry-btn">
                    Retry
                </button>
            </div>
        `;
    }
}

function displayLeagues(leagues) {
    const container = document.getElementById('leagues-container');
    if (!container) return;
    
    if (!leagues || leagues.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span>🏆</span>
                <h3>No Leagues Available</h3>
                <p>Check back later or try refreshing.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="leagues-grid">
            ${leagues.map(league => `
                <div class="league-card" onclick="selectLeague('${league}')">
                    <div class="league-logo">
                        <img src="logos/${getLeagueCode(league)}.png" alt="${league}"
                             onerror="this.src='logos/default.png'">
                    </div>
                    <div class="league-name">${league}</div>
                    <button class="view-teams-btn" onclick="event.stopPropagation(); viewTeams('${league}')">
                        View Teams
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

function getLeagueCode(leagueName) {
    const leagueMap = {
        'Premier League': 'premier',
        'La Liga': 'laliga',
        'Serie A': 'seriea',
        'Bundesliga': 'bundesliga',
        'Ligue 1': 'ligue1',
        'Champions League': 'ucl',
        'Europa League': 'uel'
    };
    
    return leagueMap[leagueName] || 'default';
}

window.selectLeague = function(league) {
    console.log('Selected league:', league);
    // Redirect to predictions with this league selected
    localStorage.setItem('selectedLeague', league);
    window.location.href = 'predictions.html';
};

window.viewTeams = function(league) {
    console.log('Viewing teams for:', league);
    // Could open a modal or redirect
    alert(`Teams for ${league} will be shown here.`);
};

document.addEventListener('DOMContentLoaded', initializeLeaguesPage);
