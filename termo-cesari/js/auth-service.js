// public/js/auth-service.js

import { auth, db } from "./firebase-config.js"; 

// Firebase Authentication (SDK v11)
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Firestore (SDK v11)
import { 
    doc, 
    setDoc 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


// -------------------------------
// REGISTRO DE USUÁRIO
// -------------------------------
export async function handleRegister(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        alert(`Usuário criado. UID: ${user.uid}`);
        // Salvar dados no Firestore
        await saveUserName(user.uid, name, email);

        return true;

    } catch (error) {
        console.error("ERRO NO REGISTRO:", error);
        alert(`Falha no registro!`);
        return false;
    }
}


// -------------------------------
// LOGIN
// -------------------------------
export async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login realizado:", userCredential.user.uid);
        return true;

    } catch (error) {
        console.error("Erro no login:", error);
        alert(`Não foi possivel realizar o login!`);
        return false;
    }
}


// -------------------------------
// LOGOUT
// -------------------------------
export async function handleLogout() {
    try {
        await signOut(auth);
        return true;

    } catch (error) {
        console.error("Erro no logout:", error);
        return false;
    }
}


// -------------------------------
// SALVAR NO FIRESTORE
// -------------------------------
export async function saveUserName(userUID, name, email) {
    try {
        alert("Salvando dados no Firestore...");

        // Agora usando setDoc com UID como chave (boa prática!)
       await setDoc(doc(db, "users", userUID), {
            usuario: name,
            nome: email,
            createdAt: new Date().toISOString()
        });

        console.log("Dados salvos com sucesso!");

    } catch (error) {
        console.error("Erro ao salvar no Firestore:", error);
        throw error;
    }
}
