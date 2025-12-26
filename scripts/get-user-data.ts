
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

async function getData() {
    console.log("Fetching raw data...");
    try {
        const snapshot = await getDocs(collection(db, 'members'));
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.name === 'Tony Stark' || data.name === 'Aditya Patil') {
                console.log(`User: ${data.name} (${doc.id})`);
                console.log(`  Stored Points: ${data.points}`);
                console.log(`  Followers: ${JSON.stringify(data.followers || [])} (Count: ${data.followers?.length || 0})`);
                console.log(`  Following: ${JSON.stringify(data.following || [])} (Count: ${data.following?.length || 0})`);
                console.log(`  Achievements: ${JSON.stringify(data.achievements || [])}`);
                console.log(`  Streak: ${data.streak || 0}`);
                console.log('--------------------------------------------------');
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}
getData();
