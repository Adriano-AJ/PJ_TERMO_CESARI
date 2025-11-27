// public/js/session.control.js

// Importa a instância de autenticação
import { auth } from "./firebase-config.js"; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


// Endereço de destino
const isLoginPage = window.location.pathname.includes("login.html");

// Ouvinte de mudança no estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user && isLoginPage) {
        // Usuário está logado E está na página de login
        window.location.href = "index.html";
    }
});

