
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Hardcoded config to avoid env issues
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
