const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = 5501;

app.use(express.json());
app.use(cors());

app.post("/getRestaurants", async (req, res) => {
  const { lat, lon } = req.body;

  res.send("Location Received!");
  const apiKey = "AIzaSyBcvo-BCmcl79jG9BnDmZYHqoFpLc2CdVc";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=restaurant&key=${apiKey}&maxresults=5`;
  try {
    const apiResponse = await fetch(url);
    const apiData = await apiResponse.json();
    // res.send(apiData);
    console.log("Reply from Server");
    console.log(apiData);

    // API Data
    const restaurantData = apiData.results.map((place) => ({
      name: place.name,
      rating: place.rating,
      price_level: place.price_level,
      user_ratings_total: place.user_ratings_total,
    }));

    res.json(restaurantData);

  } catch (error) {
    res.status(500).send({ error: "Error Fetching Data." });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
