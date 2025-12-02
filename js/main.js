// ==============================================
// MAIN APP LOGIC (for index.html)
// ==============================================

function initializeApp() {
    console.log('Initializing FOOTPredict AI App...');
    
    // Check if we're on homepage
    if (document.getElementById('homepage-container')) {
        initializeHomepage();
    }
    
    // Check backend connection on every page
    checkBackendConnection();
}

function initializeHomepage() {
    console.log('Setting up homepage...');
    
    // Load some live matches preview
    loadLiveMatchesPreview();
    
    // Setup navigation
    setupNavigation();
    
    // Setup any homepage-specific events
    setupHomepageEvents();
}

async function loadLiveMatchesPreview() {
    const container = document.getElementById('live-matches-preview');
    if (!container) return;
    
    try {
        const data = await window.apiService.getLiveMatches();
        const matches = data.live_matches || data.matches || data;
        
        if (matches && matches.length > 0) {
            // Show first 3 matches
            const previewMatches = matches.slice(0, 3);
            
            container.innerHTML = `
                <h3>Live Now ⚽</h3>
                <div class="matches-preview">
                    ${previewMatches.map(match => `
                        <div class="preview-match">
                            <div class="preview-teams">
                                ${match.home_team} vs ${match.away_team}
                            </div>
                            <div class="preview-score">${match.score || '0-0'}</div>
                            <div class="preview-status">${match.status || 'LIVE'}</div>
                        </div>
                    `).join('')}
                </div>
                <a href="live-matches.html" class="view-all-btn">View All Matches →</a>
            `;
        }
    } catch (error) {
        console.error('Failed to load live matches preview:', error);
    }
}

function setupNavigation() {
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function setupHomepageEvents() {
    // Quick prediction button
    const quickPredictBtn = document.getElementById('quick-predict');
    if (quickPredictBtn) {
        quickPredictBtn.addEventListener('click', () => {
            window.location.href = 'predictions.html';
        });
    }
}

async function checkBackendConnection() {
    try {
        await window.apiService.checkHealth();
        console.log('✓ Backend is connected');
    } catch (error) {
        console.warn('✗ Backend connection issue:', error.message);
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
