
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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
