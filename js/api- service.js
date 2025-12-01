// js/api-service.js 
import CONFIG from './config.js';

class APIService {
    constructor() {
        this.baseUrl = CONFIG.ENV === 'development' 
            ? CONFIG.LOCAL_BACKEND_URL 
            : CONFIG.BACKEND_URL;
        
        this.cache = new Map(); // Simple cache
        this.cacheDuration = 60000; // 1 minute cache
    }

    async request(endpoint, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            signal: controller.signal,
            ...options
        };
        
        for (let attempt = 1; attempt <= CONFIG.RETRY_ATTEMPTS; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, defaultOptions);
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                return data;
                
            } catch (error) {
                if (attempt === CONFIG.RETRY_ATTEMPTS) {
                    console.error(`API request failed after ${attempt} attempts:`, error);
                    throw error;
                }
                console.warn(`Attempt ${attempt} failed, retrying...`);
                await this.delay(1000 * attempt); // Exponential backoff
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Live Matches with caching
    async getLiveMatches(forceRefresh = false) {
        const cacheKey = 'live-matches';
        const now = Date.now();
        
        // Check cache first
        if (!forceRefresh && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (now - cached.timestamp < this.cacheDuration) {
                console.log('Returning cached live matches');
                return cached.data;
            }
        }
        
        try {
            const data = await this.request('/api/live-matches');
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: data,
                timestamp: now
            });
            
            return data;
        } catch (error) {
            // Try to return cached data even if expired
            if (this.cache.has(cacheKey)) {
                console.warn('Using expired cache due to API error');
                return this.cache.get(cacheKey).data;
            }
            throw error;
        }
    }

    // Other API methods
    async getLeagues() {
        return await this.request('/api/leagues');
    }
    
    async getTeams(league) {
        return await this.request(`/api/teams/${encodeURIComponent(league)}`);
    }
    
    async predictMatch(matchData) {
        return await this.request('/api/predict', {
            method: 'POST',
            body: JSON.stringify(matchData)
        });
    }
    
    async checkHealth() {
        return await this.request('/health');
    }
}

// Export singleton instance
export default new APIService();
