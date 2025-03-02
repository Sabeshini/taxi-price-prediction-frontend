import { useState } from "react";
import { FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <motion.div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center mb-4">
                    <FaCarSide className="text-yellow-500 mr-2" /> Taxi Price Predictor
                </h2>
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="Enter City 1" value={city1} 
                        onChange={(e) => setCity1(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    <input type="text" placeholder="Enter City 2" value={city2} 
                        onChange={(e) => setCity2(e.target.value)}
                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    <motion.button onClick={getFare} 
                        whileHover={{ scale: 1.1 }}
                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg font-semibold shadow-md">
                        Get Fare
                    </motion.button>
                </div>
                {fare !== null && (
                    <motion.h3 className="mt-4 text-xl font-semibold text-gray-700" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}>
                        Estimated Fare: ₹{fare}
                    </motion.h3>
                )}
            </motion.div>
        </div>
    );
}

export default App;

