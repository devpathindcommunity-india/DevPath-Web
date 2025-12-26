
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

async function getBadges() {
    try {
        const membersRef = collection(db, 'members');
        const snapshot = await getDocs(membersRef);

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.name === 'Tony Stark') {
                console.log(`User: ${data.name}`);
                console.log(`Achievements: ${JSON.stringify(data.achievements || [])}`);
                console.log('---');
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

getBadges();
