// Import necessary functions from Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";

// Firebase configuration object, values are pulled from environment variables
const FirebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, // API Key for Firebase
  authDomain: import.meta.env.VITE_AUTH_DOMAIN, // Auth domain for Firebase Authentication
  projectId: import.meta.env.VITE_PROJECT_ID, // Project ID for Firebase project
  databaseURL: import.meta.env.VITE_DATABASE_URL, // Database URL for Firebase Realtime Database
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET, // Storage Bucket for Firebase Storage
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID, // Messaging Sender ID for Firebase Cloud Messaging
  appId: import.meta.env.VITE_APP_ID, // App ID for Firebase App
  measurementId: import.meta.env.VITE_MEASUREMENT_ID, // Measurement ID for Firebase Analytics
};

// Initialize the Firebase app with the provided configuration
const FirebaseApp = initializeApp(FirebaseConfig);

// Initialize Firebase Realtime Database instance
const AppDatabase = getDatabase(FirebaseApp);

// Export Firebase database reference, set, get, child, and remove methods to use them in other parts of the app
export { AppDatabase, ref, set, get, child, remove };
