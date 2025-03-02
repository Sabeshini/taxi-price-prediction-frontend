import { useState } from "react";

function App() {
    const [fare, setFare] = useState(null);
    const [city1, setCity1] = useState("");
    const [city2, setCity2] = useState("");

    const getFare = () => {
        fetch("https://taxi-price-prediction-backend.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city1, city2 })
        })
        .then(response => response.json())
        .then(data => setFare(data.estimated_fare))
        .catch(error => console.error("Error:", error));
    };

    return (
        <div>
            <h2>Taxi Price Prediction</h2>
            <input type="text" placeholder="Enter City 1" value={city1} onChange={(e) => setCity1(e.target.value)} />
            <input type="text" placeholder="Enter City 2" value={city2} onChange={(e) => setCity2(e.target.value)} />
            <button onClick={getFare}>Get Fare</button>
            {fare !== null && <h3>Estimated Fare: ₹{fare}</h3>}
        </div>
    );
}

export default App;

