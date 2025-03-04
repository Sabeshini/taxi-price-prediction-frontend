import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");
  const [area1Suggestions, setArea1Suggestions] = useState([]);
  const [area2Suggestions, setArea2Suggestions] = useState([]);

  const fetchSuggestions = async (query, setSuggestions) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/search?query=${query}`);
      const data = await response.json();
      setSuggestions(data.map(item => item.name));
    } catch {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFare(null);
    setDistance(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area1, area2 }),
      });

      const data = await response.json();

      if (response.ok) {
        setFare(data.estimated_fare);
        setDistance(data.distance_km);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to fetch fare. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Taxi Fare Estimator 🚕</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="mb-3 position-relative">
          <label className="form-label">From (Area)</label>
          <input
            type="text"
            className="form-control"
            value={area1}
            onChange={(e) => {
              setArea1(e.target.value);
              fetchSuggestions(e.target.value, setArea1Suggestions);
            }}
            placeholder="Enter pickup location"
            required
          />
          {area1Suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100">
              {area1Suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setArea1(suggestion);
                    setArea1Suggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-3 position-relative">
          <label className="form-label">To (Area)</label>
          <input
            type="text"
            className="form-control"
            value={area2}
            onChange={(e) => {
              setArea2(e.target.value);
              fetchSuggestions(e.target.value, setArea2Suggestions);
            }}
            placeholder="Enter destination"
            required
          />
          {area2Suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100">
              {area2Suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setArea2(suggestion);
                    setArea2Suggestions([]);
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Get Fare Estimate
        </button>
      </form>

      {error && <p className="alert alert-danger">{error}</p>}

      {fare !== null && (
        <div className="alert alert-success">
          <h4>Estimated Fare: ₹{fare}</h4>
          <p>Distance: {distance} km</p>
        </div>
      )}
    </div>
  );
}

export default App;





