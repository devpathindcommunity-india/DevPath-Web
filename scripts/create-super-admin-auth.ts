import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyALGINp8VYQS17ODls_lcOHPeh4HSBVG6A",
    authDomain: "devpath-website.firebaseapp.com",
    projectId: "devpath-website",
    storageBucket: "devpath-website.firebasestorage.app",
    messagingSenderId: "1045735850932",
    appId: "1:1045735850932:web:305a30d27b23d8e8c468e1",
    measurementId: "G-6CW7LMVKJ4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function createSuperAdmin() {
    try {
        console.log("Creating Super Admin Auth user...");
        await createUserWithEmailAndPassword(auth, "ap8548328@gmail.com", "Aditya@2006@#");
        console.log("Super Admin Auth user created successfully.");
        process.exit(0);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log("User already exists.");
            process.exit(0);
        } else {
            console.error("Error creating user:", error);
            process.exit(1);
        }
    }
}

createSuperAdmin();
