import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [distance, setDistance] = useState("");
  const [price, setPrice] = useState(null);

  const fetchPrice = async () => {
    try {
      const response = await axios.post("https://taxi-backend.onrender.com/predict", {
        distance: parseFloat(distance),
      });
      setPrice(response.data.price);
    } catch (error) {
      console.error("Error fetching price:", error);
      alert("Failed to fetch price. Check backend deployment.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Taxi Price Prediction</h1>
      <input
        type="number"
        placeholder="Enter Distance (km)"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
      />
      <button onClick={fetchPrice}>Get Price</button>
      {price !== null && <h2>Estimated Price: ₹{price}</h2>}
    </div>
  );
};

export default App;
