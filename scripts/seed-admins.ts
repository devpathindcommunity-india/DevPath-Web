import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const db = getFirestore(app);
const auth = getAuth(app);

const admins = [
    {
        name: "Aditya Patil",
        email: "ap8548328@gmail.com",
        role: "Community Head & Founder",
        photoURL: "", // TODO: Add photo URL
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Aditya Akolkar",
        email: "aditya.akolkar@example.com", // Placeholder
        role: "Technical Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Pranav Khaire",
        email: "pranav.khaire@example.com", // Placeholder
        role: "Content Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    },
    {
        name: "Dev Mukherjee",
        email: "dev.mukherjee@example.com", // Placeholder
        role: "Partnerships Head",
        photoURL: "",
        github: "",
        instagram: "",
        linkedin: ""
    }
];

async function seedAdmins() {
    try {
        // Login as Super Admin to have write access
        console.log("Logging in as Super Admin...");
        await signInWithEmailAndPassword(auth, "ap8548328@gmail.com", "Aditya@2006@#");
        console.log("Logged in successfully.");

        for (const admin of admins) {
            console.log(`Seeding admin: ${admin.name}`);
            // Use email as ID (sanitized) or auto-id. Using email for easier lookup/auth mapping if needed.
            // But for public profile, maybe auto-id is safer? 
            // User said "Create Collection for Them... where the Name of Admin...".
            // Let's use a sanitized email or just a unique ID.
            // Actually, using the email as the document ID makes it easy to check "is this user an admin?"
            // But we need to be careful about PII.
            // Let's use the email as the ID for now as it's a unique identifier provided.
            await setDoc(doc(db, "admins", admin.email), admin);
        }
        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admins:", error);
        process.exit(1);
    }
}

seedAdmins();
