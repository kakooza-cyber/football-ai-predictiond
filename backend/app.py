
from flask import Flask, jsonify, render_template
import os

app = Flask(__name__)

# Simple routes that don't require ML packages
@app.route('/')
def home():
    return jsonify({"message": "Football Predictor API is running!", "status": "success"})

@app.route('/predict')
def predict():
    return jsonify({
        "prediction": "App running - ML features coming soon",
        "status": "success"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
 uvicorn app.run(host='0.0.0.0', port=port)
