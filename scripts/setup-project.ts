import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import * as readline from 'readline';

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function setupProject() {
    console.log('\n🚀 Starting DevPath Project Setup...\n');

    // 1. Check Environment Variables
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.error('❌ Error: Environment variables not found. Please create .env.local from .env.example.');
        process.exit(1);
    }
    console.log('✅ Environment variables loaded.');

    // 2. Super Admin Setup
    console.log('\n🔑 Super Admin Setup');
    console.log('To manage the database, you need to be a Super Admin.');
    console.log('Since this is your personal Firebase instance, you can add yourself manually.');

    const email = await question('Enter your email address to make yourself a Super Admin: ');

    if (email) {
        try {
            await setDoc(doc(db, 'super_admins', email), {
                email: email,
                createdAt: new Date().toISOString(),
                createdBy: 'setup-script'
            });
            console.log(`✅ Added ${email} as Super Admin.`);
        } catch (error: any) {
            console.error('❌ Error adding Super Admin:', error.message);
            console.log('⚠️  Note: If you get a permission error, you might need to manually create the "super_admins" collection in Firebase Console first, or temporarily disable rules.');
        }
    } else {
        console.log('Skipping Super Admin setup.');
    }

    // 3. Seed Roles
    console.log('\n🌱 Seeding Roles...');
    const roles = [
        { id: 'admin', name: 'Admin', description: 'Administrator with full access' },
        { id: 'member', name: 'Member', description: 'Regular community member' },
        { id: 'moderator', name: 'Moderator', description: 'Community moderator' }
    ];

    for (const role of roles) {
        try {
            await setDoc(doc(db, 'roles', role.id), role);
            console.log(`   - Role '${role.name}' seeded.`);
        } catch (error: any) {
            console.error(`   ❌ Failed to seed role '${role.name}':`, error.message);
        }
    }

    // 4. Seed Admin Key
    console.log('\n🔑 Seeding Admin Key...');
    try {
        await setDoc(doc(db, 'admin_keys', 'config'), {
            value: 'DevPath-AKDP' // Default dev key
        });
        console.log('✅ Admin Key seeded (Value: DevPath-AKDP).');
    } catch (error: any) {
        console.error('❌ Error seeding Admin Key:', error.message);
    }

    console.log('\n🎉 Setup Complete!');
    console.log('You can now run "npm run dev" to start the application.');
    rl.close();
    process.exit(0);
}

setupProject();
