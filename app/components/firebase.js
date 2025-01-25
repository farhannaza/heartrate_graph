// Import the necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase configuration (use your own Firebase project credentials)
const firebaseConfig = {
  apiKey: "AIzaSyAWlgCXHatEjo6lkeNQc7n_6QVTU8ihMhM",
  authDomain: "rberry4-9ff79.firebaseapp.com",
  databaseURL: "https://rberry4-9ff79-default-rtdb.firebaseio.com",
  projectId: "rberry4-9ff79",
  storageBucket: "rberry4-9ff79.appspot.com",
  messagingSenderId: "468040976944",
  appId: "1:468040976944:web:8003d9c607bcd560453bf5",
  measurementId: "G-6SZBS2J19F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const database = getDatabase(app);

// Export the database object
export { database };