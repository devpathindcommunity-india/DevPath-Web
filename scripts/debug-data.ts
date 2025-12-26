
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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

async function debugData() {
    const email = 'ap8548328@gmail.com';
    console.log(`--- Debugging Data for ${email} ---`);

    // 1. Check Admin Doc
    try {
        const adminDoc = await getDoc(doc(db, 'admins', email));
        if (adminDoc.exists()) {
            console.log('Admin Document Found:');
            console.log(JSON.stringify(adminDoc.data(), null, 2));

            const roleId = adminDoc.data().roleId;
            if (roleId) {
                console.log(`\nChecking Role Document: ${roleId}`);
                // 2. Check Role Doc
                const roleDoc = await getDoc(doc(db, 'roles', roleId));
                if (roleDoc.exists()) {
                    console.log('Role Document Found:');
                    console.log(JSON.stringify(roleDoc.data(), null, 2));
                } else {
                    console.error('ERROR: Role Document NOT FOUND!');
                }
            } else {
                console.error('ERROR: roleId is MISSING in Admin Document!');
            }
        } else {
            console.error('ERROR: Admin Document NOT FOUND!');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

debugData();
