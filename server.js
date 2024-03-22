const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5501;

app.use(express.json());
app.use(cors());

// Serve static files from the src directory
app.use(express.static(path.join(__dirname, 'src')));

// Catch-all handler for any request that doesn't match one above
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// ----------------------------------------------------------------------
// Database Routes
// ----------------------------------------------------------------------
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true // This enforces `email` as a unique field across the collection
  }
  // other user fields...
});

const User = mongoose.model('User', userSchema);

const userRestaurantSchema = new mongoose.Schema({
  userID: { 
    type: String,
  },
  resName: {
    type: String,
  },
  placeID: { 
    type: String,
    ref: 'Restaurant' // This creates a reference to the Restaurant model using the `placeID` field
  },
});

const UserRestaurant = mongoose.model('UserRestaurant', userRestaurantSchema);

// Check user liked restaurants when user does a search
app.get('/api/user_restaurants', async (req, res) => {
  try {
    const { userID } = req.query;
    const userLikedRestaurants = await UserRestaurant.find({ userID: userID});
    res.json(userLikedRestaurants);
  } catch {
    console.error("Error fetching liked restaurants: ", error);
    res.status(500).json({error: "Error fetching data"});
  }
});

// Create a new user-restaurant relationship
app.post('/api/user_restaurants', async (req, res) => {
  try {
    let userRestaurant = new UserRestaurant(req.body);
    userRestaurant = await userRestaurant.save();
    res.send(userRestaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// when unlike, delete from database 
app.delete('/api/delete_user_restaurants', async (req, res) => {
  try {
      const { userID, placeID } = req.query;
      
      if (!userID || !placeID) { //need to change to useremail
          return res.status(400).send('Missing userId or placeId');
      }

      const result = await UserRestaurant.deleteOne({ 
          userID: userID,
          placeID: placeID
      });

      if (result.deletedCount === 0) {
          return res.status(404).send('UserRestaurant not found');
      }

      res.send({ message: 'UserRestaurant deleted successfully' });
  } catch (error) {
      res.status(500).send(error);
  }
});

// ----------------------------------------------------------------------
// Implement Gemini AI
// ----------------------------------------------------------------------

// const express = require('express');
// const multer = require('multer');
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const app = express();
// const upload = multer({ storage: multer.memoryStorage() }); // Using memory storage for simplicity

// // Assume that you have set the API_KEY in your environment variables
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// app.post('/ask-gemini-pro', upload.single('image'), async (req, res) => {
//   try {
//     // Check for the image and question in the request
//     if (!req.file) {
//       return res.status(400).send('No image file provided.');
//     }
//     if (!req.body.question) {
//       return res.status(400).send('No question provided.');
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
//     const imagePart = {
//       inlineData: {
//         data: req.file.buffer.toString("base64"),
//         mimeType: req.file.mimetype,
//       },
//     };

//     // The question should be in the request body
//     const prompt = req.body.question;

//     const result = await model.generateContent([prompt, imagePart]);
//     const response = await result.response;
//     const text = response.text();
//     res.send(text);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



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
  // add user to the database
  if (userRecord) {
    const userId = userRecord.uid;
    const userRef = db.ref(`users/${userId}`);
    await userRef.set({ username: username })
    res.status(200).json({ redirect: '/src/login.html' });
  }
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

// Get username route
app.get('/get-username', async (req, res) => {
  const userId = req.query.uid;
  if (!userId) {
      return res.status(400).json({ alert: "User ID is required!" });
  }
  // get username from database here and return back to frontend
  const userRef = db.ref(`users/${userId}`);
  userRef.once('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
          res.status(200).json({ username: data.username });
      } else {
          res.status(404).json({ alert: "User not found!" });
      }
  });
});

// ----------------------------------------------------------------------
// Places API
// ----------------------------------------------------------------------

// For random nearby
app.post("/getRestaurants", async (req, res) => {
  const { lat, lon } = req.body;
  const apiKey = "AIzaSyBcvo-BCmcl79jG9BnDmZYHqoFpLc2CdVc";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=5000&type=restaurant&key=${apiKey}`;

  try {
    const apiResponse = await fetch(url);
    const apiData = await apiResponse.json();

    console.log("Reply from Server");
    console.log(apiData);

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
    res.status(500).send({ error: "Error Fetching Data." });
  }
});

// For specific nearby
app.post("/getSearchedRestaurants", async (req, res) => {
  const { lat, lon, userInput } = req.body;

  const apiKey = "AIzaSyBcvo-BCmcl79jG9BnDmZYHqoFpLc2CdVc";
  const query = encodeURIComponent(userInput);
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lon}&query=${query}&radius=5000&type=restaurant&key=${apiKey}`;

  try {
    const apiResponse = await fetch(url);
    const apiData = await apiResponse.json();
    console.log("Reply from Server");
    console.log(apiData);

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
    res.status(500).send({ error: "Error Fetching Data." });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

