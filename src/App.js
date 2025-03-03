import React, { useState } from "react";
import "./styles.css";
import { FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [city1Coords, setCity1Coords] = useState(null);
  const [city2Coords, setCity2Coords] = useState(null);

  const fetchFare = async () => {
    if (!city1.trim() || !city2.trim()) {
      setError("Both city fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    setFare(null);

    try {
      // Fetch fare from backend
      const response = await fetch("https://taxi-price-prediction-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city1, city2 }),
      });

      if (!response.ok) throw new Error("Failed to fetch fare");
      const data = await response.json();
      setFare(data.estimated_fare);

      // Fetch coordinates for the cities
      const city1Res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city1}`);
      const city2Res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city2}`);

      const city1Data = await city1Res.json();
      const city2Data = await city2Res.json();

      if (city1Data.length === 0 || city2Data.length === 0) {
        setError("Could not find one or both cities on the map.");
        return;
      }

      setCity1Coords({
        lat: parseFloat(city1Data[0].lat),
        lon: parseFloat(city1Data[0].lon),
      });

      setCity2Coords({
        lat: parseFloat(city2Data[0].lat),
        lon: parseFloat(city2Data[0].lon),
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

      {/* Map Section */}
      {city1Coords && city2Coords && (
        <MapContainer
          center={[city1Coords.lat, city1Coords.lon]}
          zoom={6}
          style={{ height: "400px", width: "100%", marginTop: "20px", borderRadius: "10px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[city1Coords.lat, city1Coords.lon]}>
            <Popup>{city1}</Popup>
          </Marker>
          <Marker position={[city2Coords.lat, city2Coords.lon]}>
            <Popup>{city2}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default App;



