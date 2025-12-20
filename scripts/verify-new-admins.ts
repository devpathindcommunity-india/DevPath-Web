
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
