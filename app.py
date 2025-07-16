# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
from model import NeuralNetwork   # <--- IMPORTANT

# Load trained model
with open('nn_model.pkl', 'rb') as f:
    nn = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

app = Flask(__name__)
CORS(app)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    print("Received data:", data)

    # Extract the values in the correct order your model expects
    features = [
        float(data.get("pregnancies", 0)),
        float(data["glucose"]),
        float(data["bloodPressure"]),
        float(data["skinThickness"]),
        float(data["insulin"]),
        float(data["bmi"]),
        float(data.get("diabetesPedigreeFunction", 0)),  # if used
        float(data["age"]),
    ]

    # shape for model
    features = np.array(features).reshape(1, -1)

    # dummy prediction
    prediction = 1 if features[0][1] > 125 else 0
    probability = [0.2, 0.8] if prediction else [0.9, 0.1]

    return jsonify({
        "prediction": prediction,
        "probability": probability
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
