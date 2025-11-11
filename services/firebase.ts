
// FIX: Use a namespace import for firebase/app to resolve issues with finding the 'initializeApp' named export.
import * as firebaseApp from "firebase/app";
import { getAuth } from "firebase/auth";

// =================================================================================
// IMPORTANT: YOUR ACTION IS REQUIRED HERE
// =================================================================================
//
// Replace the placeholder values below with your own Firebase project configuration.
// You can find these details in your Firebase project's settings page.
//
// Failure to do so will result in authentication errors from Firebase.
//
// =================================================================================
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
  measurementId: "YOUR_FIREBASE_MEASUREMENT_ID"
};


// Initialize Firebase App.
// This will throw an error from the Firebase SDK if the configuration is invalid.
const app = firebaseApp.initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);