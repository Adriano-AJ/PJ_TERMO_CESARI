// public/js/tutorial.js

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("tutorial-modal");
    const btnClose = document.getElementById("btn-close-tutorial");
    const btnStart = document.getElementById("btn-start-game");
    const btnToggle = document.getElementById("btn-tutorial-toggle");

    // 1. Verificar LocalStorage ao iniciar
    // Se não existir (null), assume 'true' (ativo). Se for 'false', está desativado.
    let isTutorialEnabled = localStorage.getItem("tutorialEnabled") !== "false";

    // Atualiza a aparência do botão na header
    updateToggleButton();

    // 2. Mostrar o modal se estiver ativado
    if (isTutorialEnabled) {
        openTutorial();
    }

    // --- EVENTOS ---

    // Fechar modal
    btnClose.addEventListener("click", closeTutorial);
    btnStart.addEventListener("click", closeTutorial);

    // Botão da Header (Alternar ON/OFF e Abrir se estiver OFF)
    btnToggle.addEventListener("click", () => {
        if (isTutorialEnabled) {
            // Se estava ligado, desliga
            isTutorialEnabled = false;
            localStorage.setItem("tutorialEnabled", "false");
            alert("Tutorial automático DESATIVADO.");
        } else {
            // Se estava desligado, liga e MOSTRA o tutorial agora
            isTutorialEnabled = true;
            localStorage.setItem("tutorialEnabled", "true");
            openTutorial(); // Abre para mostrar que funcionou
        }
        updateToggleButton();
    });

    // --- FUNÇÕES AUXILIARES ---

    function openTutorial() {
        modal.classList.remove("hidden");
    }

    function closeTutorial() {
        modal.classList.add("hidden");
    }

    function updateToggleButton() {
        if (isTutorialEnabled) {
            btnToggle.textContent = "TUTORIAL: ON";
            btnToggle.classList.remove("disabled");
            btnToggle.style.borderColor = "#28a745"; // Borda verde
        } else {
            btnToggle.textContent = "TUTORIAL: OFF";
            btnToggle.classList.add("disabled");
            btnToggle.style.borderColor = "#dc3545"; // Borda vermelha
        }
    }
});