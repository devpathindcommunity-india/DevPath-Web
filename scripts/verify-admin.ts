
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

dotenv.config({ path: '.env.local' });

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

async function verifyAdmin() {
    try {
        const email = 'ap8548328@gmail.com';
        console.log(`Fetching admin: ${email}`);
        const docRef = doc(db, 'admins', email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Admin Data:', JSON.stringify(docSnap.data(), null, 2));
        } else {
            console.log('No such document!');
        }
    } catch (error) {
        console.error('Error fetching admin:', error);
    }
}

verifyAdmin();
