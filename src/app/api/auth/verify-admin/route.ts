import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key } = body;

        if (!key) {
            return NextResponse.json({ success: false, message: 'Key is required' }, { status: 400 });
        }

        // Fetch the key securely on the server side
        const docRef = doc(db, 'admin_keys', 'config');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.error('Admin key config not found in Firestore');
            return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
        }

        const actualKey = docSnap.data().value;

        // Perform the verification securely away from the browser
        if (key === actualKey) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid Admin Key. Please try again.' }, { status: 401 });
        }

    } catch (error) {
        console.error('Error verifying admin key:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}