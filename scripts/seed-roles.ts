
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

const roles = {
    'community-head': {
        title: "Community Head & Founder",
        tasks: [
            "Oversee all community operations",
            "Strategic planning and growth",
            "Manage Core Team and Leads",
            "Final decision making on all projects"
        ]
    },
    'core-team': {
        title: "Core Team Member",
        tasks: [
            "Lead specific domains (Tech, Events, etc.)",
            "Mentor community members",
            "Organize and manage events",
            "Contribute to open source projects"
        ]
    },
    'member': {
        title: "Community Member",
        tasks: [
            "Participate in events and workshops",
            "Contribute to community projects",
            "Learn and grow with peers",
            "Network with other developers"
        ]
    }
};

async function seedRoles() {
    try {
        console.log('Seeding Roles...');

        // 1. Seed Roles
        for (const [id, data] of Object.entries(roles)) {
            await setDoc(doc(db, 'roles', id), data);
            console.log(`Seeded role: ${id}`);
        }

        // 2. Update Super Admin with 'community-head' role
        const superAdminEmail = 'ap8548328@gmail.com';
        console.log(`Updating Super Admin (${superAdminEmail})...`);
        await setDoc(doc(db, 'admins', superAdminEmail), {
            roleId: 'community-head'
        }, { merge: true });

        console.log('Roles seeded and Super Admin updated successfully!');
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
}

seedRoles();
