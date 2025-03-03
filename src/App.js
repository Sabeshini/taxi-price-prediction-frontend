import React, { useState } from "react";
import "./styles.css";
import { FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";

const App = () => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFare = async () => {
    if (!city1.trim() || !city2.trim()) {
      setError("Both city fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    setFare(null);

    try {
      const response = await fetch("https://taxi-price-prediction-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city1, city2 }),
      });

      if (!response.ok) throw new Error("Failed to fetch fare");

      const data = await response.json();
      setFare(data.estimated_fare);
    } catch (error) {
      setError("Error fetching fare. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        Taxi Price Prediction
      </motion.h1>

      <div className="input-container">
        <input type="text" placeholder="Enter City 1" value={city1} onChange={(e) => setCity1(e.target.value)} />
        <input type="text" placeholder="Enter City 2" value={city2} onChange={(e) => setCity2(e.target.value)} />
        <button onClick={fetchFare} disabled={loading}>
          {loading ? "Calculating..." : "Get Fare"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {fare !== null && (
        <motion.div className="result" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <FaCarSide className="car-icon" />
          <h2>Estimated Fare: ₹{fare}</h2>
        </motion.div>
      )}
    </div>
  );
};

export default App;


