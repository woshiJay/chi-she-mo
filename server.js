const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = 5501;

app.use(express.json());
app.use(cors());

// ----------------------------------------------------------------------
// Initializing of Firebase Admin SDK
// ----------------------------------------------------------------------
const admin = require('firebase-admin')
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chi-se-mo-default-rtdb.asia-southeast1.firebasedatabase.app/"
});
const db = admin.database();

// ----------------------------------------------------------------------
// Initializing of Firebase SDK
// ----------------------------------------------------------------------
const firebase = require("firebase/app");
const firebaseAuth = require("firebase/auth");
const firebaseConfig = {
  apiKey: "AIzaSyBTybXLML4LVemnnav7vAvvlwbd9XE0WQc",
  authDomain: "chi-se-mo.firebaseapp.com",
  databaseURL: "https://chi-se-mo-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "chi-se-mo",
  storageBucket: "chi-se-mo.appspot.com",
  messagingSenderId: "460919636016",
  appId: "1:460919636016:web:07051c3573000ca1b12df5"
};

firebase.initializeApp(firebaseConfig);

// ----------------------------------------------------------------------
// Authentication
// ----------------------------------------------------------------------

// Sign up route
app.post('/signup', async (req, res) => {

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
      res.status(400).json({ alert: 'Please ensure that all fields are filled.' });
      return;
  }
  const auth = getAuth();

  const userRecord = await auth.createUser({
      email: email,
      password: password
  })
      .catch((error) => {
          if (error.code === 'auth/email-already-exists') {
              res.status(400).json({ alert: 'Email already exists! Please proceed to Login.' });
          } else {
              res.status(400).json({ alert: error.code })
          }
      })

  const userId = userRecord.uid;
  const userRef = db.ref(`users/${userId}`);
  await userRef.set({ username: username })
  res.status(200).json({ redirect: '/src/login.html' });
});

// Sign in route
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const firebaseAuthentication = firebaseAuth.getAuth();

  firebaseAuth.signInWithEmailAndPassword(firebaseAuthentication, email, password)
      .then((userCredential) => {
          // Signed in
          res.status(200).json({ message: "User signed in successfully!", uid: userCredential.user.uid })
      })
      .catch((error) => {
          res.status(401).json({ alert: 'Invalid email or password! Please try again.' });
      });
});

// Sign out route
app.get('/signout', async (req, res) => {
  firebaseAuth.getAuth().signOut()
      .then(() => {
          res.status(200).json({ message: "User signed out successfully!" })
      })
      .catch((error) => {
      });
});

// ----------------------------------------------------------------------
// Database Routes
// ----------------------------------------------------------------------
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json()); // for parsing application/json

const port_db = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  // other fields...
});
  
const Item = mongoose.model('Item', itemSchema);

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch (error) {
    res.status(500).send(error);
  }
});
  
app.put('/api/items/:id', async (req, res) => {
  const { name, description } = req.body;
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!item) return res.status(404).send('Item not found');
    res.send(item);
  } catch (error) {
    res.status(500).send(error);
  }
});


// ----------------------------------------------------------------------
// Places API
// ----------------------------------------------------------------------

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
