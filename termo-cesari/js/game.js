// public/js/game.js

// --- Importações ---
import { saveGameResult } from "./score-service.js"; 

// --- Configurações do Jogo ---
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 5;

// 1. Lista de Palavras Secretas (Respostas Possíveis - Mantemos o Gist pois é curado para o jogo)
const SECRET_WORDS_API_URL = 'https://gist.githubusercontent.com/Adriano-AJ/f6c70754afa07becc07a34497ee8c67b/raw/d3b5941149a8f5f0caaabd4c3d88cc394c7bf8dd/gistfile1.txt';

// 2. Caminho Local do Dicionário Completo (Validação)
// (Certifique-se de que o arquivo 'dicionario.txt' está na pasta 'public')
const ALL_WORDS_LOCAL_PATH = './dicionario.txt';

// Estado do Jogo
let secretWord = "";
let validWordsSet = new Set(); // Set normalizado (sem acentos) para validação
let currentAttempt = 0;
let currentTile = 0;
let isGameOver = false;
let isLoading = true;

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
    try {
        console.log("Iniciando jogo...");
        await loadWords();
        
        // Sorteia uma palavra secreta da lista principal
        const randomIndex = Math.floor(Math.random() * secretWordsList.length);
        secretWord = secretWordsList[randomIndex];
        
        console.log("Palavra Secreta:", secretWord); // Cheat para testes
        
        isLoading = false;
        createGrid();
        
    } catch (error) {
        
    }
}

// Variável auxiliar apenas para o sorteio
let secretWordsList = [];

async function loadWords() {
    try {
        // Carrega as duas listas simultaneamente
        const [secretsResponse, allWordsResponse] = await Promise.all([
            fetch(SECRET_WORDS_API_URL),
            fetch(ALL_WORDS_LOCAL_PATH)
        ]);

        if (!secretsResponse.ok) throw new Error("Erro ao carregar lista de segredos (Gist)");
        if (!allWordsResponse.ok) throw new Error("Erro ao carregar dicionario.txt local");

        const secretsText = await secretsResponse.text();
        const allWordsText = await allWordsResponse.text();

        // 1. Prepara a lista de RESPOSTAS (Mantém acentos originais para exibir no final)
        secretWordsList = secretsText.split('\n')
            .map(w => w.trim().toUpperCase())
            .filter(w => w.length === WORD_LENGTH);

        // 2. Prepara o Dicionário de VALIDAÇÃO (Remove acentos para facilitar a busca)
        // O arquivo 'dicionario.txt' tem palavras de todos os tamanhos, vamos filtrar só as de 5
        const allWords = allWordsText.split('\n')
            .map(w => w.trim())
            .filter(w => w.length === WORD_LENGTH); // Filtra apenas 5 letras

        // Cria o Set Normalizado (Sem acentos: ÁGUIA vira AGUIA)
        validWordsSet = new Set(
            allWords.map(w => w.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase())
        );

        // Garante que as palavras secretas também estejam no validador
        secretWordsList.forEach(word => {
            const normalized = word.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
            validWordsSet.add(normalized);
        });

    } catch (error) {
        throw error;
    }
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
    
    // Normaliza o que o usuário digitou para verificar no dicionário
    const guessNormalized = guess.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    // 2. Validação atualizada
    if (!validWordsSet.has(guessNormalized)) {
        alert("Palavra não existe na lista!");
        shakeRow(currentAttempt);
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
        
        // --- CÁLCULO DE PONTOS ---
        // Array de pontos por tentativa: 
        // 1ª: 100pts, 2ª: 80pts, 3ª: 60pts, 4ª: 40pts, 5ª: 20pts
        const pointsTable = [100, 80, 60, 40, 20];
        const pointsEarned = pointsTable[currentAttempt];

        // Salva no Firebase
        saveGameResult(pointsEarned);

        // Mostra o Modal
        setTimeout(() => {
            showGameOverModal(true, currentAttempt + 1, pointsEarned);
        }, 500);

    } else {
            // Jogo continua
            if(currentAttempt === MAX_ATTEMPTS - 1) {
                isGameOver = true;

                // Mostra o Modal de Derrota
                setTimeout(() => {
                    showGameOverModal(false, MAX_ATTEMPTS);
                }, 500);

                return;
            }

            // Próxima tentativa
            currentAttempt++;
            currentTile = 0;
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

// Altere a assinatura da função para receber 'points'
function showGameOverModal(isWin, attemptsUsed, points = 0) {
    const modal = document.getElementById('game-over-modal');
    const title = document.getElementById('modal-title');
    const icon = document.getElementById('modal-icon');
    const wordDisplay = document.getElementById('modal-word');
    const attemptsText = document.getElementById('modal-attempts');

    // Preenche a palavra secreta
    wordDisplay.textContent = secretWord;

    if (isWin) {
        title.textContent = "Parabéns!";
        title.style.color = "#28a745"; 
        icon.textContent = "🏆";
        // Adiciona a informação dos pontos
        attemptsText.innerHTML = `Você conseguiu em ${attemptsUsed} tentativa(s).<br><strong>+${points} PONTOS!</strong>`;
    } else {
        title.textContent = "Fim de Jogo!";
        title.style.color = "#dc3545"; 
        icon.textContent = "💀";
        attemptsText.textContent = `Você usou todas as tentativas.`;
    }

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