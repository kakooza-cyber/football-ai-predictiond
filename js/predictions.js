// File: js/predictions.js 
import CONFIG from './config.js';
import './api-service.js';

async function predictMatch() {
    const homeTeam = document.getElementById('homeTeam').value;
    const awayTeam = document.getElementById('awayTeam').value;
    const league = document.getElementById('league').value;
    
    if (!homeTeam || !awayTeam) {
        alert('Please select both teams');
        return;
    }
    
    try {
        const result = await window.apiService.predictMatch({
            home_team: homeTeam,
            away_team: awayTeam,
            league: league
        });
        
        displayPrediction(result);
    } catch (error) {
        console.error('Prediction error:', error);
        document.getElementById('predictionResult').innerHTML = `
            <div class="error">Failed to get prediction: ${error.message}</div>
        `;
    }
}

function displayPrediction(data) {
    //displayPrediction() function 
  function displayPrediction(data) {
    const prediction = data.prediction; // "Home Win"
    const confidence = data.confidence; // 57
    
    // Create prediction card
    return `
        <div class="prediction-card">
            <h3>Prediction: ${prediction}</h3>
            <div class="confidence">
                Confidence: 
                <span class="confidence-value ${getConfidenceClass(confidence)}">
                    ${confidence}%
                </span>
            </div>
            <div class="probabilities">
                <div class="prob home-win">
                    <div class="prob-label">Home Win</div>
                    <div class="prob-bar" style="width: ${data.probabilities.home_win}%"></div>
                    <div class="prob-value">${data.probabilities.home_win}%</div>
                </div>
                <div class="prob draw">
                    <div class="prob-label">Draw</div>
                    <div class="prob-bar" style="width: ${data.probabilities.draw}%"></div>
                    <div class="prob-value">${data.probabilities.draw}%</div>
                </div>
                <div class="prob away-win">
                    <div class="prob-label">Away Win</div>
                    <div class="prob-bar" style="width: ${data.probabilities.away_win}%"></div>
                    <div class="prob-value">${data.probabilities.away_win}%</div>
                </div>
            </div>
        </div>
    `;
  }
    // This will show the prediction with probabilities, xG, etc.
}

// Initialize prediction page
document.addEventListener('DOMContentLoaded', function() {
    // Load leagues dropdown
    loadLeaguesDropdown();
    
    // Setup form submit
    document.getElementById('predictForm').addEventListener('submit', function(e) {
        e.preventDefault();
        predictMatch();
    });
});
