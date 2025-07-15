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

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    features_scaled = scaler.transform(features)
    pred, prob = nn.predict(features_scaled)

    result = {
        "prediction": int(pred[0][0]),
        "probability": float(prob[0][0])
    }
    print(result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
