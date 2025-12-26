
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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

async function fixAdminRole() {
    const email = 'ap8548328@gmail.com';
    console.log(`Fixing role for ${email}...`);

    try {
        await setDoc(doc(db, 'admins', email), {
            roleId: 'community-head'
        }, { merge: true });

        console.log('Update command sent.');

        // Verify immediately
        const docSnap = await getDoc(doc(db, 'admins', email));
        if (docSnap.exists()) {
            console.log('Verification:', JSON.stringify(docSnap.data(), null, 2));
        } else {
            console.log('Document still does not exist!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fixAdminRole();
