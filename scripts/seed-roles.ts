
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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
