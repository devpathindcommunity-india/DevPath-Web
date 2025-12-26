
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

async function verifyNewAdmins() {
    const admins = [
        { email: 'adi.akolkar12@gmail.com', roleId: 'technical-head' },
        { email: 'khairepranav246@gmail.com', roleId: 'content-graphics-head' }
    ];

    console.log('--- Verifying New Admins ---');

    for (const admin of admins) {
        try {
            console.log(`Checking ${admin.email}...`);
            const docSnap = await getDoc(doc(db, 'admins', admin.email));
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log(`  Found! Role ID: ${data.roleId}`);
                if (data.roleId === admin.roleId) {
                    console.log('  ✅ Role ID matches.');
                } else {
                    console.error(`  ❌ Role ID MISMATCH! Expected ${admin.roleId}, got ${data.roleId}`);
                }

                // Verify Role Doc exists
                const roleDoc = await getDoc(doc(db, 'roles', admin.roleId));
                if (roleDoc.exists()) {
                    console.log(`  ✅ Role Document (${admin.roleId}) exists.`);
                } else {
                    console.error(`  ❌ Role Document (${admin.roleId}) MISSING!`);
                }

            } else {
                console.error(`  ❌ Admin Document NOT FOUND!`);
            }
        } catch (error) {
            console.error('Error verifying:', error);
        }
    }
}

verifyNewAdmins();
