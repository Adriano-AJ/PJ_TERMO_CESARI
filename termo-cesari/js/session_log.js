// public/js/session_log.js

import { auth } from "./firebase-config.js";
import { handleLogout } from "./auth-service.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link');
    const warningBanner = document.getElementById('login-warning'); // <--- NOVO: Captura o banner
    
    if (!authLink) {
        console.error("Elemento auth-link não encontrado.");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // --- USUÁRIO LOGADO ---
            // 1. Navbar
            authLink.textContent = "LOGOUT";
            authLink.href = "#"; 
            authLink.addEventListener('click', handleLogoutClick);

            // 2. Esconde o aviso (se o elemento existir na página)
            if (warningBanner) {
                warningBanner.classList.add('hidden');
            }

        } else {
            // --- USUÁRIO DESLOGADO ---
            // 1. Navbar
            authLink.textContent = "LOGIN";
            authLink.href = "login.html";
            authLink.removeEventListener('click', handleLogoutClick);

            // 2. Mostra o aviso para avisar que não vai pontuar
            if (warningBanner) {
                warningBanner.classList.remove('hidden');
            }
        }
    });

    function handleLogoutClick(e) {
        e.preventDefault();
        handleLogout();
    }
});