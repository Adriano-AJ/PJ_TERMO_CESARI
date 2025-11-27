// public/js/login.control.js

// Importa a função de login do nosso serviço de autenticação
import { handleLogin } from "./auth-service.js"; 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    // 1. Adicionar o evento de SUBMIT ao formulário
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o envio padrão e o recarregamento da página

            // 2. Capturar os valores dos inputs
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // 3. Validações Simples (Front-end)
            if (email.length === 0 || password.length === 0) {
                alert("Por favor, preencha todos os campos.");
                return;
            }
            
            // 4. Chamada à API (Firebase)
            await handleLogin(email, password);

            // O redirecionamento será tratado pelo observador de estado (UX 3.1)
        });
    }
});