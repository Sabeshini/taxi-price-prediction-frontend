function predictFare() {
    const city1 = document.getElementById('city1').value;
    const city2 = document.getElementById('city2').value;

    if (!city1 || !city2) {
        alert("Please enter both cities!");
        return;
    }

    fetch("https://taxi-price-prediction-backend.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city1, city2 })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerHTML = `Estimated Fare: ₹${data.estimated_fare}`;
    })
    .catch(error => {
        console.error("Error fetching price:", error);
        document.getElementById('result').innerHTML = "Error fetching price. Try again!";
    });
}
