
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

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
