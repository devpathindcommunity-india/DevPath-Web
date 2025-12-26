import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

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

async function deleteDuplicate() {
    console.log("Searching for duplicate Pranav Khaire to delete...");

    const membersRef = collection(db, 'members');
    const q = query(membersRef, where("name", "==", "Pranav Khaire"));
    const snapshot = await getDocs(q);

    let deletedCount = 0;

    for (const memberDoc of snapshot.docs) {
        const data = memberDoc.data();
        const points = data.points || 0;

        // Target the one with ~103 points (less than 200 to be safe)
        if (points < 200) {
            console.log(`Deleting duplicate user: ${memberDoc.id} with ${points} points...`);

            // Delete from members
            await deleteDoc(doc(db, 'members', memberDoc.id));
            console.log(`- Deleted from members`);

            // Delete from leaderboard
            await deleteDoc(doc(db, 'leaderboard', memberDoc.id));
            console.log(`- Deleted from leaderboard`);

            deletedCount++;
        } else {
            console.log(`Keeping user: ${memberDoc.id} with ${points} points.`);
        }
    }

    if (deletedCount === 0) {
        console.log("No duplicate found with < 200 points.");
    } else {
        console.log(`Successfully deleted ${deletedCount} duplicate(s).`);
    }

    process.exit();
}

deleteDuplicate();
