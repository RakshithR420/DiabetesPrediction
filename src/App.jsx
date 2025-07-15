import { useState } from "react";
import "./index.css";

function App() {
  const featureNames = [
    "Number of times pregnant",
    "Plasma glucose concentration (2 hr OGTT)",
    "Diastolic blood pressure (mm Hg)",
    "Triceps skin fold thickness (mm)",
    "2-Hour serum insulin (μU/ml)",
    "Body mass index (kg/m²)",
    "Diabetes pedigree function",
    "Age (years)",
  ];

  const [inputs, setInputs] = useState(Array(featureNames.length).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, value) => {
    const updated = [...inputs];
    updated[index] = value;
    setInputs(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          features: inputs.map(Number),
        }),
      });

      if (!response.ok) {
        throw new Error("Server error. Please try again.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          Diabetes Risk Prediction
        </h1>

        <p className="text-gray-700 text-center mb-8">
          Enter patient health metrics below to estimate diabetes risk.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {featureNames.map((name, i) => (
            <div key={i} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {name}
              </label>
              <input
                type="number"
                step="any"
                placeholder={name}
                value={inputs[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded mt-4 transition duration-300"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Prediction Result
            </h2>
            <p className="text-gray-700">
              <span className="font-semibold">Outcome:</span>{" "}
              <span
                className={`font-bold ${
                  result.prediction === 1 ? "text-red-600" : "text-green-600"
                }`}
              >
                {result.prediction === 1
                  ? "High Diabetes Risk"
                  : "Low Diabetes Risk"}
              </span>
            </p>

            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Probabilities:</span>
              <br />
              <span className="text-gray-600">
                Class 0 (No Diabetes):{" "}
                <span className="font-mono">
                  {Number(result.probability).toFixed(3)}
                </span>
              </span>
              <br />
              <span className="text-gray-600">
                Class 1 (Diabetes):{" "}
                <span className="font-mono">
                  {Number(1 - result.probability).toFixed(3)}
                </span>
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
