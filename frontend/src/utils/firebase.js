// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const {
  initializeAppCheck,
  ReCaptchaV3Provider,
} = require("firebase/app-check");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALTXc1igwncljB-feZrFsWt_Flv56xWwo",
  authDomain: "polar-storm-335415.firebaseapp.com",
  projectId: "polar-storm-335415",
  storageBucket: "polar-storm-335415.appspot.com",
  messagingSenderId: "165237520277",
  appId: "1:165237520277:web:ba0bc80a709142d3a2289c",
  measurementId: "G-EG4MGJR0BR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage_source_pictures = getStorage(
  app,
  "gs://dfp-source-pictures"
);
export const storage_portraits = getStorage(app, "gs://dfp-portraits");
export const storage_results = getStorage(app, "gs://dfp-results");
export const storage_swap_pictures = getStorage(app, "gs://dfp-swap-pictures");
export const storage_portraits_metadata = getStorage(
  app,
  "gs://dfp-portraits-metadata"
);

if (process.env.NODE_ENV === "development") {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

signInAnonymously(auth)
  .then(() => {
    // Signed in..
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode);
    console.error(errorMessage);
    // ...
  });
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfpEvohAAAAALBNzDdAdVl1Bohh3GeBkNEdObpQ"),
  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});
