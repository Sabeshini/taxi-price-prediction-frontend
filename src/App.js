import React, { useState } from "react";
import "./styles.css";
import { FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [area1Coords, setArea1Coords] = useState(null);
  const [area2Coords, setArea2Coords] = useState(null);

  const fetchFare = async () => {
    if (!area1.trim() || !area2.trim()) {
      setError("Both area fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    setFare(null);

    try {
      const response = await fetch("https://taxi-price-prediction-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city1: area1, city2: area2 }),
      });

      if (!response.ok) throw new Error("Failed to fetch fare");
      const data = await response.json();
      setFare(data.estimated_fare);

      const area1Res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${area1}, Chennai`);
      const area2Res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${area2}, Chennai`);

      const area1Data = await area1Res.json();
      const area2Data = await area2Res.json();

      if (area1Data.length === 0 || area2Data.length === 0) {
        setError("Could not find one or both areas on the map.");
        return;
      }

      setArea1Coords({
        lat: parseFloat(area1Data[0].lat),
        lon: parseFloat(area1Data[0].lon),
      });

      setArea2Coords({
        lat: parseFloat(area2Data[0].lat),
        lon: parseFloat(area2Data[0].lon),
      });
    } catch (error) {
      setError("Error fetching fare or location data. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <motion.h1 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        Chennai Taxi Price Prediction
      </motion.h1>

      <div className="input-container">
        <input type="text" placeholder="Enter Area 1" value={area1} onChange={(e) => setArea1(e.target.value)} />
        <input type="text" placeholder="Enter Area 2" value={area2} onChange={(e) => setArea2(e.target.value)} />
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

      {area1Coords && area2Coords && (
        <MapContainer
          center={[area1Coords.lat, area1Coords.lon]}
          zoom={12}
          style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[area1Coords.lat, area1Coords.lon]}>
            <Popup>{area1}</Popup>
          </Marker>
          <Marker position={[area2Coords.lat, area2Coords.lon]}>
            <Popup>{area2}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default App;



