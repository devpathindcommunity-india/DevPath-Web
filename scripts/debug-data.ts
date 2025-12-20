
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
