require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, collection } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ROLES = [
  'Founder & Community Lead',
  'Operations Lead (COO)',
  'Community & Inclusion Lead',
  'Women in Tech Lead',
  'Technology Lead (Discord Head)',
  'Learning & Programs Lead',
  'Marketing & Brand Lead',
  'Partnerships & Outreach Lead',
  'Growth & Analytics Lead',
  'City Leads (Network Head)'
];

async function seed() {
  console.log('Starting seed...');
  
  // Seed admin keys
  for (const role of ROLES) {
    await setDoc(doc(db, 'admin_keys', role), {
      key: 'AKDP' // Setting default key to AKDP for all roles for now
    });
    console.log(`Created admin key for: ${role}`);
  }

  // Add dummy team members to show the leaderboard works
  const dummyMembers = [
    {
      name: "Aditya Patil",
      role: "City Lead",
      subRole: "Pune Chapter Lead",
      points: 1500,
      monthlyPoints: 300,
      lastUpdatedMonth: "2026-07"
    },
    {
      name: "Jane Doe",
      role: "Technical Contributor",
      subRole: "Frontend Developer",
      points: 1200,
      monthlyPoints: 400,
      lastUpdatedMonth: "2026-07"
    }
  ];

  for (let i = 0; i < dummyMembers.length; i++) {
    const memberRef = doc(collection(db, 'team_members'));
    await setDoc(memberRef, dummyMembers[i]);
    console.log(`Created dummy member: ${dummyMembers[i].name}`);
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(console.error);
