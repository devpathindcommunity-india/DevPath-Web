
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

const newRoles = {
    'technical-head': {
        title: "Technical Head",
        tasks: [
            "Lead technical architecture and decisions",
            "Oversee development of community projects",
            "Mentor technical team members",
            "Manage code quality and deployment standards"
        ]
    },
    'content-graphics-head': {
        title: "Content and Graphics Head",
        tasks: [
            "Oversee all content creation and strategy",
            "Manage brand identity and graphics",
            "Lead content and design teams",
            "Ensure consistency across all platforms"
        ]
    }
};

const newAdmins = [
    {
        email: 'adi.akolkar12@gmail.com',
        data: {
            name: "Aditya Akolkar",
            role: "admin",
            roleId: "technical-head",
            bio: "Technical Head at DevPath",
            github: "https://github.com/adi-akolkar", // Placeholder
            linkedin: "https://linkedin.com/in/adi-akolkar" // Placeholder
        }
    },
    {
        email: 'khairepranav246@gmail.com',
        data: {
            name: "Pranav Khaire",
            role: "admin",
            roleId: "content-graphics-head",
            bio: "Content and Graphics Head at DevPath",
            github: "https://github.com/pranav-khaire", // Placeholder
            linkedin: "https://linkedin.com/in/pranav-khaire" // Placeholder
        }
    }
];

async function seedNewAdmins() {
    try {
        console.log('Seeding New Roles and Admins...');

        // 1. Seed New Roles
        for (const [id, data] of Object.entries(newRoles)) {
            await setDoc(doc(db, 'roles', id), data);
            console.log(`Seeded role: ${id}`);
        }

        // 2. Seed New Admins
        for (const admin of newAdmins) {
            await setDoc(doc(db, 'admins', admin.email), admin.data, { merge: true });
            console.log(`Seeded admin: ${admin.email}`);
        }

        console.log('New roles and admins seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedNewAdmins();
