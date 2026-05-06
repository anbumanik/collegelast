import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBuB83QBlGIR6RC__mvZOU6HQMfJzKiYBA",
  authDomain: "sample-ecommerce1.firebaseapp.com",
  databaseURL: "https://sample-ecommerce1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sample-ecommerce1",
  storageBucket: "sample-ecommerce1.firebasestorage.app",
  messagingSenderId: "437620030748",
  appId: "1:437620030748:web:4180136ffc4c9847198ed9",
  measurementId: "G-VDDG1Q58GE"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const rtdb = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Analytics is only supported in browser environments
const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { rtdb, storage, auth, analytics };

