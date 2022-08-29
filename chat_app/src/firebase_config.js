// to see when user was created, use auth.currentUser.metadata.createdAt
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-AZt8Lv18EUQfh5CGsljXdcVVtT2tjDk",
    authDomain: "chat-app-cdbc3.firebaseapp.com",
    projectId: "chat-app-cdbc3",
    storageBucket: "chat-app-cdbc3.appspot.com",
    messagingSenderId: "869541891404",
    appId: "1:869541891404:web:e295970bfa0cdc3cbc13e9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);