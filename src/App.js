import React, { useState } from "react";
import "./App.css";

const LocationInput = ({ label, value, onChange, suggestions, onSelect }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Start typing..."
        className="location-input"
      />
      {suggestions.length > 0 && (
        <ul className="dropdown">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => onSelect(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const App = () => {
  const [area1, setArea1] = useState("");
  const [area2, setArea2] = useState("");
  const [suggestions1, setSuggestions1] = useState([]);
  const [suggestions2, setSuggestions2] = useState([]);
  const [carType, setCarType] = useState("sedan");
  const [result, setResult] = useState(null);

  const handleInputChange = (value, setArea, setSuggestions) => {
    setArea(value);
    if (value.length > 2) {
      // Fetch suggestions based on input
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value},Tamil Nadu`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data.map((item) => item.display_name));
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area1, area2, car_type: carType }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="App">
      <h1>Taxi Fare Estimator</h1>
      <LocationInput
        label="Pickup Location"
        value={area1}
        onChange={(e) => handleInputChange(e.target.value, setArea1, setSuggestions1)}
        suggestions={suggestions1}
        onSelect={(value) => {
          setArea1(value);
          setSuggestions1([]);
        }}
      />
      <LocationInput
        label="Drop-off Location"
        value={area2}
        onChange={(e) => handleInputChange(e.target.value, setArea2, setSuggestions2)}
        suggestions={suggestions2}
        onSelect={(value) => {
          setArea2(value);
          setSuggestions2([]);
        }}
      />
      <select value={carType} onChange={(e) => setCarType(e.target.value)}>
        <option value="sedan">Sedan</option>
        <option value="suv">SUV</option>
        <option value="hatchback">Hatchback</option>
      </select>
      <button onClick={handleSubmit}>Get Fare Estimate</button>
      {result && (
        <div className="result">
          <p>Distance: {result.distance_km} km</p>
          <p>Estimated Fare: ₹{result.estimated_fare}</p>
        </div>
      )}
    </div>
  );
};

export default App;