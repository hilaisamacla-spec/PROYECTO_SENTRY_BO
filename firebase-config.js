// firebase-config.js
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");

const firebaseConfig = {
  apiKey: "AIzaSyAMdHfi5E-5eWmEYti3zEEyJ4e3Di6lHCI",
  authDomain: "sentry-bo-v1.firebaseapp.com",
  projectId: "sentry-bo-v1",
  storageBucket: "sentry-bo-v1.firebasestorage.app",
  messagingSenderId: "649887878541",
  appId: "1:649887878541:web:f59a0adf2861a33739c1c4"
};

// Inicializar solo una vez
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

module.exports = firebase;
