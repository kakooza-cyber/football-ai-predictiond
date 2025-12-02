// Inside js/predictions.js
document.addEventListener('DOMContentLoaded', () => {
    // Example: Get leagues when the page loads
    getLeagues().then(leagues => {
        // Logic to populate a dropdown menu with the fetched leagues
    });

    // Example: Handle a button click to get a prediction
    document.getElementById('predict-button').addEventListener('click', () => {
        const data = { /* collect user input */ };
        postPrediction(data).then(result => {
            // Logic to display the result on the screen
        });
    });
});
                                  
