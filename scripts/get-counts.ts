
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

const SOCIAL_BADGES = ['social-github', 'social-linkedin', 'social-instagram'];

async function getCounts() {
    try {
        const membersRef = collection(db, 'members');
        const snapshot = await getDocs(membersRef);

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.name === 'Tony Stark' || data.name === 'Aditya Patil') {
                const uid = doc.id;
                const achievements = data.achievements || [];
                let socialBadges = 0;
                let standardBadges = 0;
                achievements.forEach((b: string) => {
                    if (SOCIAL_BADGES.includes(b)) socialBadges++;
                    else standardBadges++;
                });

                const followers = (data.followers || []).length;
                const streak = data.streak || 0;

                // Fetch projects
                const projectsRef = collection(db, 'members', uid, 'projects');
                const projectsSnap = await getDocs(projectsRef);
                const projectCount = projectsSnap.size;
                let totalStars = 0;
                projectsSnap.forEach(p => totalStars += (p.data().stars || []).length);

                console.log(`User: ${data.name}`);
                console.log(`  Social Badges: ${socialBadges}`);
                console.log(`  Standard Badges: ${standardBadges}`);
                console.log(`  Followers: ${followers}`);
                console.log(`  Projects: ${projectCount}`);
                console.log(`  Stars: ${totalStars}`);
                console.log(`  Streak: ${streak}`);
                console.log('---');
            }
        }
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

getCounts();
