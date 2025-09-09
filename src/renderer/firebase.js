// src/renderer/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAPBnQJF1hokQpVlMUByh2VZZ6cA5eI0R4",
  authDomain: "helpdesk-457916.firebaseapp.com",
  projectId: "helpdesk-457916",
  storageBucket: "helpdesk-457916.firebasestorage.app",
  messagingSenderId: "270817564776",
  appId: "1:270817564776:web:afc046561675760e05c3dd"
};

// Inicializar app y base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Exportar todo lo necesario
export {
  db,
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
};
