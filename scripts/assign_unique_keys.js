require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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

const generateKey = (role) => {
  const acronym = role.split(/[\s&()]+/).filter(w => w.length > 0).map(w => w[0].toUpperCase()).join('');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${acronym}-${randomStr}`;
};

async function assignUniqueKeys() {
  console.log('Generating unique keys...');
  const keysMapping = {};
  
  for (const role of ROLES) {
    const uniqueKey = generateKey(role);
    await setDoc(doc(db, 'admin_keys', role), {
      key: uniqueKey
    });
    keysMapping[role] = uniqueKey;
    console.log(`Created unique key for: ${role}`);
  }

  // Save the mapping to a file so we can show it to the user
  const outputPath = path.join(__dirname, '../generated_keys.json');
  fs.writeFileSync(outputPath, JSON.stringify(keysMapping, null, 2));

  console.log('Successfully assigned unique keys!');
  process.exit(0);
}

assignUniqueKeys().catch(console.error);
