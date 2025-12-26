
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkDuplicates() {
    console.log("Checking for duplicates...");
    try {
        const membersRef = collection(db, 'members');
        const adminsRef = collection(db, 'admins');

        const membersSnap = await getDocs(membersRef);
        const adminsSnap = await getDocs(adminsRef);

        console.log("--- MEMBERS ---");
        membersSnap.forEach(doc => {
            const data = doc.data();
            if (data.name === 'Tony Stark') {
                console.log(`ID: ${doc.id}, Name: ${data.name}, Points: ${data.points}, Badges: ${JSON.stringify(data.achievements)}`);
            }
        });

        console.log("--- ADMINS ---");
        adminsSnap.forEach(doc => {
            const data = doc.data();
            if (data.name === 'Tony Stark') {
                console.log(`ID: ${doc.id}, Name: ${data.name}, Points: ${data.points}, Badges: ${JSON.stringify(data.achievements)}`);
            }
        });

    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

checkDuplicates();
