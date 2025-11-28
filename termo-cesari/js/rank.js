// public/js/rank.js
import { getLeaderboard } from "./score-service.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("rank-table-body");
    
    // Busca os dados do serviço
    const leaderboard = await getLeaderboard();

    // Limpa a mensagem de "Carregando..."
    tableBody.innerHTML = "";

    if (leaderboard.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum registro encontrado. Jogue para pontuar!</td></tr>`;
        return;
    }

    // Cria as linhas da tabela
    leaderboard.forEach((user, index) => {
        const row = document.createElement("tr");
        
        // Lógica de medalhas para top 3
        let posDisplay = index + 1;
        if (index === 0) posDisplay = "👑 1º";
        if (index === 1) posDisplay = "✨ 2º";
        if (index === 2) posDisplay = "💎 3º";
        if (index === 3) posDisplay = "🥇 4º";
        if (index === 4) posDisplay = "🥈 5º";
        if (index === 5) posDisplay = "🥉 6º";

        row.innerHTML = `
            <td>${posDisplay}</td>
            <td><strong>${user.name}</strong></td>
            <td>${user.games}</td>
            <td class="score-val">${user.score} pts</td>
        `;
        tableBody.appendChild(row);
    });

});
