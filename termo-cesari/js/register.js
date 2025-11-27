// public/js/register.control.js

// Importa a função de registro do nosso serviço de autenticação
import { handleRegister } from "./auth-service.js"; 

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');

    // 1. Adicionar o evento de SUBMIT ao formulário
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o envio padrão e o recarregamento da página

            // 2. Capturar os valores dos inputs
            const name = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // 3. Validações Simples (Front-end)
            if (password !== confirmPassword) {
                alert("As senhas não coincidem. Por favor, verifique.");
                return;
            }
            if (password.length < 6) {
                alert("A senha deve ter pelo menos 6 caracteres.");
                return;
            }
            if (name.length === 0) {
                alert("O campo Nome é obrigatório.");
                return;
            }
            
            // 4. Chamada à API (Firebase)
            // Nota: O nome não é enviado ao Firebase Auth, mas será útil para o Firestore (Cartão DB 4.2)
            const success = await handleRegister(email, password, name);

            if (success) {
                // TODO: Cartão UX 3.5: Salvar o NOME do usuário no Firestore aqui, 
                // pois o Firebase Auth só salva email/senha.
                // Depois disso, o observador de estado (UX 3.1) fará o redirecionamento.
                alert("Registro bem-sucedido! Você será redirecionado em breve.");
                window.location.href = "index.html";
                // (Por enquanto, a função handleRegister já avisa do sucesso e alerta o redirecionamento)
            }
        });
    }
});