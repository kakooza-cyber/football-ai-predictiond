import API_CONFIG from './config.js';

class APIService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    async predictMatch(matchData) {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.PREDICT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(matchData)
        });
        return await response.json();
    }

    async getLiveMatches() {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.LIVE_MATCHES}`);
        return await response.json();
    }

    async getLeagues() {
        const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.LEAGUES}`);
        return await response.json();
    }

    async getTeams(league) {
        const response = await fetch(
            `${this.baseUrl}${API_CONFIG.ENDPOINTS.TEAMS}/${encodeURIComponent(league)}`
        );
        return await response.json();
    }

    async checkHealth() {
        const response = await fetch(`${this.baseUrl}/health`);
        return await response.json();
    }
}

export default new APIService();
