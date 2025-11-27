// public/js/firebase-config.js

// Firebase App (obrigatório)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firebase Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// --- CONFIGURAÇÃO DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyDUMCaU6bhs4_0l7KeXODF1g5zL-PQ217A",
  authDomain: "termo-cesari.firebaseapp.com",
  projectId: "termo-cesari",
  storageBucket: "termo-cesari.firebasestorage.app",
  messagingSenderId: "953333731336",
  appId: "1:953333731336:web:64ce54227fa49678eb01bd"
};


// --- INICIALIZA FIREBASE ---
const app = initializeApp(firebaseConfig);

// --- SERVIÇOS EXPORTADOS ---
export const auth = getAuth(app);
export const db = getFirestore(app);
