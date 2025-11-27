# 🐺 Termo Cesari

> Um jogo de palavras interativo inspirado no Wordle, desenvolvido com foco em lógica JavaScript moderna e uma interface limpa e responsiva.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 🖼️ Visão Geral

O **Termo Cesari** é um desafio diário onde o objetivo é descobrir uma palavra secreta de 5 letras em até 6 tentativas. O projeto foi construído para praticar manipulação avançada de DOM, consumo de APIs assíncronas e lógica de programação.

## 🚀 Funcionalidades

- [x] **Mecânica de Jogo Completa:** Lógica de verificação de palavras com feedback visual (Verde/Amarelo/Cinza).
- [x] **Teclado Virtual Interativo:** As teclas mudam de cor conforme o progresso do jogador.
- [x] **Validação via API:** As palavras são verificadas contra um dicionário remoto (GitHub Gist) para impedir palpites inválidos.
- [x] **Responsividade:** Layout adaptável para Desktops e Dispositivos Móveis.
- [x] **Sistema de Feedback:** Modal personalizado de Vitória/Derrota (sem `alerts` nativos).
- [x] **Compartilhamento:** Função para copiar o resultado em emojis para a área de transferência.
- [ ] **Sistema de Login:** Autenticação de usuários (Em andamento com Firebase).
- [ ] **Ranking Global:** Leaderboard com as melhores pontuações (Planejado).

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5, CSS3 (Flexbox & Grid), JavaScript (ES6+ Modules).
* **Estilização:** CSS Puro com variáveis e animações (`keyframes`).
* **Fontes:** Google Fonts (Poppins e Oswald).
* **API:** Consumo de dados via `fetch` API.
* **Back-end (Planejado):** Firebase (Authentication & Firestore).

## 📂 Estrutura do Projeto

O projeto segue uma estrutura organizada separando responsabilidades:

```text
termo-cesari/
│
├── public/
│   ├── assets/          # Imagens e Logos
│   ├── css/
│   │   ├── game.css     # Estilos do jogo e modal
│   │   ├── auth.css     # Estilos de login/registro
│   │   └── global.css   # Variáveis e resets
│   ├── js/
│   │   ├── game.js      # Lógica principal do jogo
│   │   ├── auth.js      # Lógica de autenticação (Firebase)
│   │   └── ...
│   ├── index.html       # Tela do Jogo
│   ├── login.html       # Tela de Login
│   └── register.html    # Tela de Registro
│
└── README.md
