import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBVlS4KKjRqJgttPOLEMo6R-q1eo47e904",
  authDomain: "madhub-app.firebaseapp.com",
  projectId: "madhub-app",
  storageBucket: "madhub-app.appspot.com",
  messagingSenderId: "272707417339",
  appId: "1:272707417339:web:5c922ac635d320ca20ec5e",
  measurementId: "G-XBHDF150G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, db };