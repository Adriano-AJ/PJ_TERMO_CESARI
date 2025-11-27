// public/js/navbar.control.js

import { auth} from "./firebase-config.js";
import { handleLogout } from "./auth-service.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


document.addEventListener('DOMContentLoaded', () => {
    const authLink = document.getElementById('auth-link');
    
    if (!authLink) {
        console.error("Elemento auth-link não encontrado. Verifique o HTML.");
        return;
    }

    // Usamos o onAuthStateChanged para garantir que a barra de navegação
    // esteja sempre sincronizada com o status do Firebase.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // --- USUÁRIO LOGADO ---
            // 1. Muda o texto para LOGOUT
            authLink.textContent = "LOGOUT";
            
            // 2. Remove o HREF padrão e adiciona o evento de logout
            authLink.href = "#"; 
            authLink.addEventListener('click', handleLogoutClick);

        } else {
            // --- USUÁRIO DESLOGADO ---
            // 1. Muda o texto para LOGIN
            authLink.textContent = "LOGIN";
            
            // 2. Garante que o link leve para a página de login
            authLink.href = "login.html";
            authLink.removeEventListener('click', handleLogoutClick);
        }
    });

    // Função separada para o evento de clique em LOGOUT
    function handleLogoutClick(e) {
        e.preventDefault();
        // Chama a função handleLogout do auth-service
        handleLogout();
        // O session.control.js fará o redirecionamento pós-logout
    }

    // OPCIONAL: Ligar a função de logout ao link 'ABOUT' ou 'RANK' se for o caso
    // Para fins deste exercício, só precisamos do link principal.
});