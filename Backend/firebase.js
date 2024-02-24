const firebase = require("firebase/app");

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
const fbApp = firebase.initializeApp(firebaseConfig);

module.exports = { fbApp };