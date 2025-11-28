// public/js/score-service.js

import { db, auth } from "./firebase-config.js";
import { 
    doc, 
    updateDoc, 
    increment, 
    collection, 
    query, 
    orderBy, 
    limit, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- SALVAR PONTUAÇÃO ---
export async function saveGameResult(points) {
    const user = auth.currentUser;

    if (!user) {
        console.warn("Usuário não logado. Pontuação não será salva.");
        return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
        // Usamos 'increment' para somar aos pontos que o usuário já tem
        await updateDoc(userRef, {
            totalScore: increment(points),
            gamesPlayed: increment(1),
            lastPlayed: new Date().toISOString()
        });
        console.log(`Sucesso! +${points} pontos para ${user.email}`);
    } catch (error) {
        console.error("Erro ao salvar pontuação:", error);
    }
}

// --- BUSCAR RANKING GLOBAL ---
export async function getLeaderboard() {
    try {
        const usersRef = collection(db, "users");
        
        // Busca os usuários ordenados por 'totalScore' (maior para menor)
        // Limitamos a 10 ou 20 usuários para não carregar demais
        const q = query(usersRef, orderBy("totalScore", "desc"), limit(20));
        
        const querySnapshot = await getDocs(q);
        
        const leaderboard = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            leaderboard.push({
                name: data.usuario || "Anônimo", // Campo 'usuario' salvo no registro
                score: data.totalScore || 0,
                games: data.gamesPlayed || 0
            });
        });

        return leaderboard;
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        return [];
    }
}