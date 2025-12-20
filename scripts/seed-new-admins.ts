
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
