// public/js/game.js

// --- Configurações do Jogo ---
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 5;
// URL do Gist com a lista de palavras (separadas por quebra de linha)
const WORDS_API_URL = 'https://gist.githubusercontent.com/Adriano-AJ/f6c70754afa07becc07a34497ee8c67b/raw/d3b5941149a8f5f0caaabd4c3d88cc394c7bf8dd/gistfile1.txt';

// Estado do Jogo
let secretWord = "";
let validWordsSet = new Set(); // Usamos Set para busca rápida O(1)
let currentAttempt = 0;
let currentTile = 0;
let isGameOver = false;
let isLoading = true; // Trava o jogo enquanto carrega

let guesses = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
];

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    initGame();
    setupInputs();
});

async function initGame() {
    // 1. Buscar palavras da API
    try {
        console.log("Carregando palavras...");
        await loadWords();
        isLoading = false;
        console.log("Jogo pronto!");
    } catch (error) {
        alert("Erro ao carregar lista de palavras. Verifique sua conexão.");
        console.error(error);
        return;
    }

    // 2. Escolher palavra aleatória do SET convertido em Array
    const wordsArray = Array.from(validWordsSet);
    const randomIndex = Math.floor(Math.random() * wordsArray.length);
    secretWord = wordsArray[randomIndex];
    
    console.log("Palavra Secreta (Debug):", secretWord); 

    // 3. Criar o Grid no HTML
    createGrid();
}

async function loadWords() {
    const response = await fetch(WORDS_API_URL);
    if (!response.ok) throw new Error("Falha na requisição");
    
    const text = await response.text();
    
    // Transforma o texto em array, limpa espaços, converte para maiúsculo e filtra por 5 letras
    const words = text.split('\n')
        .map(w => w.trim().toUpperCase())
        .filter(w => w.length === WORD_LENGTH);
        
    // Cria o Set para validação rápida depois
    validWordsSet = new Set(words);
}

function createGrid() {
    const board = document.getElementById("game-board");
    board.innerHTML = ""; 

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement("div");
        row.className = "word-row";
        row.setAttribute("id", `row-${i}`);

        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement("div");
            tile.className = "letter-box";
            tile.setAttribute("id", `row-${i}-tile-${j}`);
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function setupInputs() {
    // 1. Teclado Virtual
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.addEventListener("click", () => {
            const keyValue = key.getAttribute("data-key");
            handleInput(keyValue);
        });
    });

    // 2. Teclado Físico
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        
        if (key === "enter") {
            handleInput("enter");
        } else if (key === "backspace") {
            handleInput("backspace");
        } else if (/^[a-zç]$/.test(key)) { 
            handleInput(key);
        }
    });
}

// --- Lógica Principal ---

function handleInput(key) {
    if (isGameOver || isLoading) return; // Não deixa digitar se estiver carregando ou acabou

    if (key === "enter") {
        checkGuess();
    } else if (key === "backspace") {
        deleteLetter();
    } else {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentTile < WORD_LENGTH && currentAttempt < MAX_ATTEMPTS) {
        const tile = document.getElementById(`row-${currentAttempt}-tile-${currentTile}`);
        tile.textContent = letter;
        tile.classList.add("active");
        
        guesses[currentAttempt][currentTile] = letter.toUpperCase();
        
        currentTile++;
    }
}

function deleteLetter() {
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(`row-${currentAttempt}-tile-${currentTile}`);
        tile.textContent = "";
        tile.classList.remove("active");
        guesses[currentAttempt][currentTile] = "";
    }
}

function checkGuess() {
    // 1. Verificar tamanho
    if (currentTile !== WORD_LENGTH) {
        alert("Palavra muito curta!");
        return;
    }

    const guess = guesses[currentAttempt].join("");

    // 2. NOVA VERIFICAÇÃO: A palavra existe no dicionário?
    if (!validWordsSet.has(guess)) {
        alert("Palavra não existe na lista!");
        shakeRow(currentAttempt); // Efeito visual de erro (opcional, adicionei abaixo)
        return; 
    }
    
    // 3. Lógica de Cores (Algoritmo do Wordle)
    const rowTiles = document.getElementById(`row-${currentAttempt}`).children;
    const secretWordArray = secretWord.split("");
    const guessArray = guess.split("");
    
    // Passo A: Verdes
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i] === secretWordArray[i]) {
            updateTileColor(rowTiles[i], "correct");
            updateKeyColor(guessArray[i], "correct");
            secretWordArray[i] = null; 
            guessArray[i] = null;
        }
    }

    // Passo B: Amarelos e Cinzas
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArray[i]) { 
            const indexInSecret = secretWordArray.indexOf(guessArray[i]);
            
            if (indexInSecret > -1) {
                updateTileColor(rowTiles[i], "present");
                updateKeyColor(guessArray[i], "present");
                secretWordArray[indexInSecret] = null;
            } else {
                updateTileColor(rowTiles[i], "absent");
                updateKeyColor(guessArray[i], "absent");
            }
        }
    }

    // 4. Verificar Vitória ou Derrota (Atualizado com Modal)
    const originalGuess = guesses[currentAttempt].join("");
    
    if (originalGuess === secretWord) {
        isGameOver = true;
        // Espera um pouco para a animação da última letra terminar antes de mostrar o modal
        setTimeout(() => {
            showGameOverModal(true, currentAttempt + 1);
        }, 500);
    } else {
        if (currentAttempt === MAX_ATTEMPTS - 1) {
            isGameOver = true;
            setTimeout(() => {
                showGameOverModal(false, MAX_ATTEMPTS);
            }, 500);
        } else {
            // Jogo continua
            currentAttempt++;
            currentTile = 0;
        }
    }
}

// --- Funções Auxiliares de UI ---

function updateTileColor(tile, status) {
    tile.classList.add(status);
    tile.style.borderColor = "transparent"; 
}

function updateKeyColor(letter, status) {
    const keyButton = document.querySelector(`.key[data-key="${letter.toLowerCase()}"]`);
    
    if (keyButton) {
        if (keyButton.classList.contains("correct")) return;
        
        if (keyButton.classList.contains("present") && status === "correct") {
            keyButton.classList.remove("present");
            keyButton.classList.add("correct");
            return;
        }

        keyButton.classList.add(status);
    }
}

// Pequena animação de erro
function shakeRow(rowIndex) {
    const row = document.getElementById(`row-${rowIndex}`);
    row.style.transform = "translateX(-5px)";
    setTimeout(() => row.style.transform = "translateX(5px)", 100);
    setTimeout(() => row.style.transform = "translateX(-5px)", 200);
    setTimeout(() => row.style.transform = "translateX(0)", 300);
}

// --- Funções do Modal de Fim de Jogo ---

function showGameOverModal(isWin, attemptsUsed) {
    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('modal-title');
    const icon = document.getElementById('modal-icon');
    const wordDisplay = document.getElementById('modal-word');
    const attemptsText = document.getElementById('modal-attempts');

    // Preenche a palavra secreta
    wordDisplay.textContent = secretWord;

    if (isWin) {
        title.textContent = "Parabéns!";
        title.style.color = "#28a745"; // Verde
        icon.textContent = "🏆";
        attemptsText.textContent = `Você conseguiu em ${attemptsUsed} tentativa(s)!`;
    } else {
        title.textContent = "Não foi dessa vez...";
        title.style.color = "#dc3545"; // Vermelho
        icon.textContent = "😓";
        attemptsText.textContent = "Acabaram suas tentativas.";
    }

    // Mostra o modal
    modal.classList.remove('hidden');
}

// Lógica do botão "Jogar Novamente"
document.getElementById('btn-restart').addEventListener('click', () => {
    location.reload(); // Recarrega a página para reiniciar
});

// Lógica do botão "Compartilhar" (Gera os quadradinhos)
document.getElementById('btn-share').addEventListener('click', () => {
    let shareText = `Termo Cesari ${currentAttempt + 1}/${MAX_ATTEMPTS}\n\n`;
    
    // Gera os emojis baseado no seu array de 'guesses' e na palavra secreta
    // Nota: Essa é uma lógica simplificada. O ideal é guardar o estado das cores das tentativas anteriores.
    // Para simplificar agora, vou pegar as classes do HTML.
    
    for (let i = 0; i <= currentAttempt; i++) {
        const row = document.getElementById(`row-${i}`);
        if(!row) continue;
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.getElementById(`row-${i}-tile-${j}`);
            if (tile.classList.contains('correct')) shareText += "🟩";
            else if (tile.classList.contains('present')) shareText += "🟨";
            else shareText += "⬛";
        }
        shareText += "\n";
    }

    // Copia para a área de transferência
    navigator.clipboard.writeText(shareText).then(() => {
        alert("Resultado copiado! Cole no WhatsApp.");
    });
});