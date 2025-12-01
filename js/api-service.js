// ==============================================
// API SERVICE LAYER - Handles all backend communication
// ==============================================

class APIService {
    constructor() {
        // Get configuration
        const config = window.CONFIG || {};
        
        // Set base URL based on environment
        this.baseUrl = config.ENV === 'development' 
            ? config.LOCAL_BACKEND_URL 
            : config.BACKEND_URL;
        
        this.endpoints = config.ENDPOINTS || {};
        this.timeout = config.TIMEOUT || 10000;
        this.retryAttempts = config.RETRY_ATTEMPTS || 3;
        
        // Initialize cache
        this.cache = new Map();
        this.cacheDuration = config.CACHE_DURATION || 30000;
        
        console.log(`✓ API Service initialized. Backend: ${this.baseUrl}`);
    }
    
    // ==============================================
    // CORE REQUEST METHOD
    // ==============================================
    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            signal: controller.signal,
            ...options
        };
        
        // Retry logic
        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                console.log(`API Request: ${this.baseUrl}${endpoint} (Attempt ${attempt})`);
                
                const response = await fetch(`${this.baseUrl}${endpoint}`, defaultOptions);
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }
                
                const data = await response.json();
                console.log(`✓ API Response from ${endpoint}:`, data);
                return data;
                
            } catch (error) {
                console.warn(`Attempt ${attempt} failed for ${endpoint}:`, error.message);
                
                if (attempt === this.retryAttempts) {
                    throw new Error(`API request failed after ${attempt} attempts: ${error.message}`);
                }
                
                // Wait before retrying (exponential backoff)
                await this.delay(1000 * attempt);
            }
        }
    }
    
    // Helper: Delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // ==============================================
    // HEALTH CHECK
    // ==============================================
    async checkHealth() {
        return await this.request(this.endpoints.HEALTH);
    }
    
    // ==============================================
    // LIVE MATCHES
    // ==============================================
    async getLiveMatches(forceRefresh = false) {
        const cacheKey = 'live-matches';
        const now = Date.now();
        
        // Check cache first
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheDuration) {
                console.log('✓ Returning cached live matches');
                return cached.data;
            }
        }
        
        try {
            const data = await this.request(this.endpoints.LIVE_MATCHES);
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: now
            });
            
            return data;
        } catch (error) {
            console.error('Failed to fetch live matches:', error);
            
            // Return cached data even if expired
            if (this.cache.has(cacheKey)) {
                console.warn('⚠️ Using expired cache for live matches');
                return this.cache.get(cacheKey).data;
            }
            
            throw error;
        }
    }
    
    // ==============================================
    // LEAGUES
    // ==============================================
    async getLeagues() {
        const cacheKey = 'leagues';
        const now = Date.now();
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }
        
        try {
            const data = await this.request(this.endpoints.LEAGUES);
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: now
            });
            
            return data;
        } catch (error) {
            console.error('Failed to fetch leagues:', error);
            
            // Return default leagues if cache is empty
            return { 
                leagues: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'] 
            };
        }
    }
    
    // ==============================================
    // TEAMS
    // ==============================================
    async getTeams(league) {
        const cacheKey = `teams-${league}`;
        const now = Date.now();
        
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheDuration) {
                return cached.data;
            }
        }
        
        try {
            const data = await this.request(`${this.endpoints.TEAMS}/${encodeURIComponent(league)}`);
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: now
            });
            
            return data;
        } catch (error) {
            console.error(`Failed to fetch teams for ${league}:`, error);
            
            // Return default teams for popular leagues
            const defaultTeams = {
                'Premier League': ['Arsenal', 'Chelsea', 'Manchester United', 'Liverpool', 'Manchester City'],
                'La Liga': ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Valencia'],
                'Serie A': ['AC Milan', 'Inter Milan', 'Juventus', 'Napoli', 'Roma']
            };
            
            return { 
                teams: defaultTeams[league] || ['Team 1', 'Team 2', 'Team 3'] 
            };
        }
    }
    
    // ==============================================
    // PREDICTIONS
    // ==============================================
    async predictMatch(matchData) {
        console.log('Making prediction request:', matchData);
        
        try {
            const data = await this.request(this.endpoints.PREDICT, {
                method: 'POST',
                body: JSON.stringify(matchData)
            });
            
            return data;
        } catch (error) {
            console.error('Prediction failed:', error);
            
            // Return demo prediction data
            return {
                match: matchData,
                prediction: "Home Win",
                confidence: 65,
                probabilities: {
                    home_win: 65,
                    draw: 20,
                    away_win: 15
                },
                analysis: {
                    expected_goals_home: 2.1,
                    expected_goals_away: 0.8,
                    both_teams_score_prob: 45,
                    over_2_5_goals_prob: 60,
                    key_factors: [
                        `${matchData.home_team} has strong home form`,
                        `${matchData.away_team} poor away record`,
                        "Demo data - Backend unavailable"
                    ]
                },
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // ==============================================
    // CLEAR CACHE
    // ==============================================
    clearCache() {
        this.cache.clear();
        console.log('✓ Cache cleared');
    }
}

// Create and expose global instance
window.apiService = new APIService();

console.log('✓ API Service ready');
