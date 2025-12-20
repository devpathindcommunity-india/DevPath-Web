
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('Checking Environment Variables...');
const required = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
];

required.forEach(key => {
    if (process.env[key]) {
        console.log(`${key}: LOADED (${process.env[key]?.length} chars)`);
    } else {
        console.log(`${key}: MISSING`);
    }
});
