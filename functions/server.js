require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5501;
const functions = require('firebase-functions')

app.use(express.json());
app.use(cors());

// ----------------------------------------------------------------------
// Initializing of Firebase Admin SDK
// ----------------------------------------------------------------------
const admin = require('firebase-admin');
const { getAuth } = require("firebase-admin/auth");

if (!admin.apps.length) {
  admin.initializeApp();  // No need for service account in Firebase Functions
}

const db = admin.database();

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://chi-se-mo-default-rtdb.asia-southeast1.firebasedatabase.app/"
// });

// ----------------------------------------------------------------------
// Initializing of Firebase SDK
// ----------------------------------------------------------------------
const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const fetch = require("node-fetch");
const firebaseConfig = {
  apiKey: functions.config().app.firebase_api_key,
  authDomain: functions.config().app.firebase_auth_domain,
  databaseURL: functions.config().app.firebase_database_url,
  projectId: functions.config().app.firebase_project_id,
  storageBucket: functions.config().app.firebase_storage_bucket,
  messagingSenderId: functions.config().app.firebase_messaging_sender_id,
  appId: functions.config().app.firebase_app_id
};

firebase.initializeApp(firebaseConfig);

// ----------------------------------------------------------------------
// Authentication
// ----------------------------------------------------------------------

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ alert: 'Please ensure that all fields are filled.' });
  }
  
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    await db.ref(`users/${userRecord.uid}`).set({ username });
    res.status(200).json({ redirect: '/src/pages/login.html' });
  } catch (error) {
    console.error("Signup Error:", error);  // Log errors for better debugging
    res.status(400).json({ alert: error.message });
  }
});

// Sign in route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const firebaseAuthentication = firebaseAuth.getAuth();

  try {
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(firebaseAuthentication, email, password);
    const userId = userCredential.user.uid;

    // Fetch the user's data
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const data = snapshot.val();

    if (data) {
      res.status(200).json({ uid: userId, username: data.username });
    } else {
      res.status(404).json({ alert: "User not found!" });
    }
  } catch (error) {
    res.status(401).json({ alert: 'Invalid email or password! Please try again.' });
  }
});

// Sign out route
app.get('/signout', async (req, res) => {
  try {
    await firebaseAuth.getAuth().signOut();
    res.status(200).json({ message: "User signed out successfully!" });
  } catch (error) {
    res.status(500).json({ alert: "Error signing out" });
  }
});

// Get username route
app.get('/get-username', async (req, res) => {
  console.log("Received GET request for /get-username");  // Add this log
  const userId = req.query.uid;
  if (!userId) {
    return res.status(400).json({ alert: "User ID is required!" });
  }

  try {
    const userRef = db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const data = snapshot.val();

    if (data) {
      console.log("User Data:", data);
      res.setHeader('Cache-Control', 'no-store'); // Prevent caching
      res.status(200).json({ username: data.username });
    } else {
      res.status(404).json({ alert: "User not found!" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ alert: "Error fetching user data" });
  }
});

// ----------------------------------------------------------------------
// User Restaurants
// ----------------------------------------------------------------------

// Check user liked restaurants when user does a search
app.get('/api/user_restaurants', async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const userLikedRestaurantsRef = db.ref(`user_restaurants/${userID}`);
    const snapshot = await userLikedRestaurantsRef.once('value');
    console.log("Snapshot Data:", snapshot.val()); // Debugging

    const userLikedRestaurants = snapshot.val() || {};
    const formattedRestaurants = Object.values(userLikedRestaurants).map((res) => ({
      resName: res.resName,
      placeID: res.placeID
    }));
    res.json(formattedRestaurants);
  } catch (error) {
    console.error('Error fetching liked restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch liked restaurants' });
  }
});

// Create a new user-restaurant relationship
app.post('/api/user_restaurants', async (req, res) => {
  try {
    const { userID, resName, placeID } = req.body;
    if (!userID || !resName || !placeID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log("Data added:", { resName, placeID, userID });
    const userRestaurantRef = db.ref(`user_restaurants/${userID}/${placeID}`);
    await userRestaurantRef.set({ resName, placeID });
    res.status(200).json({ message: "Restaurant added successfully" });
  } catch (error) {
    console.error('Error adding restaurant:', error);
    res.status(500).json({ error: "Error adding restaurant" });
  }
});

// When unlike, delete from database
app.delete('/api/delete_user_restaurants', async (req, res) => {
  try {
    const { userID, placeID } = req.query;
    if (!userID || !placeID) {
      return res.status(400).json({ error: "User ID and Place ID are required!" });
    }
    const userRestaurantRef = db.ref(`user_restaurants/${userID}/${placeID}`);
    await userRestaurantRef.remove();
    res.status(200).json({ message: 'UserRestaurant deleted successfully' });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({ error: "Error deleting restaurant" });
  }
});

// ----------------------------------------------------------------------
// Places API
// ----------------------------------------------------------------------

// For random nearby
app.post("/getRestaurants", async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=restaurant&key=${apiKey}`;

  try {
    const apiResponse = await fetch(url);
    const apiData = await apiResponse.json();

    if (apiResponse.ok) {
      const restaurants = apiData.results.map((restaurant) => ({
        name: restaurant.name,
        rating: restaurant.rating == 0 ? "No rating available" : restaurant.rating,
        place_id: restaurant.place_id
      }));

      res.json(restaurants);
    } else {
      res.status(apiResponse.status).json({ error: apiData.error.message || "Error Fetching Data."})
    }
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Data." });
  }
});

// For specific nearby
app.post("/getSearchedRestaurants", async (req, res) => {
  const { lat, lon, userInput } = req.body;

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const query = encodeURIComponent(userInput);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lon}&query=${query}&radius=5000&type=restaurant&key=${apiKey}`;

  try {
    const apiResponse = await fetch(url);
    const apiData = await apiResponse.json();

    if (apiResponse.ok) {
      const restaurants = apiData.results.map((restaurant) => ({
        name: restaurant.name,
        rating: restaurant.rating == 0 ? "No rating available" : restaurant.rating,
        place_id: restaurant.place_id
      }));

      res.json(restaurants);
    } else {
      res.status(apiResponse.status).json({ error: apiData.error.message || "Error Fetching Data."})
    }
  } catch (error) {
    res.status(500).json({ error: "Error Fetching Data." });
  }
});

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Catch-all handler for any request that doesn't match one above
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'src', '404.html'));
});

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });