// ===== Firebase Configuration =====
// Replace these values with YOUR Firebase project config from:
// Firebase Console → Project Settings → Your Apps → Web App → Config
//
// Leave as-is to use MOCK DATA (demo mode)
// Fill in your values to use LIVE ESP32 DATA

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "",              // ← Paste your API key
  authDomain: "",          // ← e.g. safecross-xxxxx.firebaseapp.com
  databaseURL: "",         // ← e.g. https://safecross-xxxxx-default-rtdb.firebaseio.com
  projectId: "",           // ← e.g. safecross-xxxxx
  storageBucket: "",       // ← e.g. safecross-xxxxx.appspot.com
  messagingSenderId: "",
  appId: "",
};

// Check if Firebase is configured (user has filled in credentials)
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "" && firebaseConfig.databaseURL !== "";
};

// Initialize Firebase only if configured
let app = null;
let database = null;

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("✅ Firebase connected — using LIVE ESP32 data");
  } catch (err) {
    console.warn("⚠️ Firebase init failed, falling back to mock data:", err.message);
  }
} else {
  console.log("ℹ️ Firebase not configured — using MOCK data (demo mode)");
}

export { database, ref, onValue, set };
export default app;
