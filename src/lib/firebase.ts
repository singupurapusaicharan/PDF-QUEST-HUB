// Firebase Configuration
// IMPORTANT: Replace these values with your actual Firebase config
// Get your config from: https://console.firebase.google.com
// See GOOGLE_OAUTH_SETUP.md for detailed setup instructions

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// TODO: Replace with your actual Firebase configuration
// You can also use environment variables for better security:
// apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlFfNdARxKc7udlAwc0360MUyfVQ1lVtU",
  authDomain: "pdf-quest-hub.firebaseapp.com",
  projectId: "pdf-quest-hub",
  storageBucket: "pdf-quest-hub.firebasestorage.app",
  messagingSenderId: "964320794455",
  appId: "1:964320794455:web:4b05077d29d20d36161012",
  measurementId: "G-W7RFMJJGE8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google provider to ALWAYS show account selection
// This prevents auto-login and forces the user to choose an account
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // ⭐ This is the key setting that forces account picker
});
