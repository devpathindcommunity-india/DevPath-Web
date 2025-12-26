
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Hardcoded config to avoid env issues
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

async function verifyData() {
    try {
        console.log('--- Verifying Admin Data ---');
        const email = 'ap8548328@gmail.com';
        const adminDoc = await getDoc(doc(db, 'admins', email));

        if (adminDoc.exists()) {
            const data = adminDoc.data();
            console.log('Admin Document:', JSON.stringify(data, null, 2));

            if (data.roleId) {
                console.log(`\n--- Verifying Role Data (${data.roleId}) ---`);
                const roleDoc = await getDoc(doc(db, 'roles', data.roleId));
                if (roleDoc.exists()) {
                    console.log('Role Document:', JSON.stringify(roleDoc.data(), null, 2));
                } else {
                    console.error('ERROR: Role document does not exist!');
                }
            } else {
                console.error('ERROR: Admin document missing roleId!');
            }
        } else {
            console.error('ERROR: Admin document does not exist!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyData();
