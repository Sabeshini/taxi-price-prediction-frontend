import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [vehicleType, setVehicleType] = useState("sedan");
  const [fare, setFare] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFare(null);
    setDistance(null);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area1, area2, vehicle_type: vehicleType }),
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
        <div className="mb-3">
          <label className="form-label">From (Area)</label>
          <input
            type="text"
            className="form-control"
            value={area1}
            onChange={(e) => setArea1(e.target.value)}
            placeholder="Enter pickup location"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">To (Area)</label>
          <input
            type="text"
            className="form-control"
            value={area2}
            onChange={(e) => setArea2(e.target.value)}
            placeholder="Enter destination"
            required
          />
        </div>

        {/* Vehicle Selection Dropdown */}
        <div className="mb-3">
          <label className="form-label">Select Vehicle</label>
          <select
            className="form-select"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="auto">Auto Rickshaw</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="luxury">Luxury Car</option>
          </select>
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
          <p>Vehicle Type: {vehicleType.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}

export default App;
