import type { Metadata } from 'next';
import ProfileClient from '../client';

export function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: { params: Promise<{ uid: string }> }): Promise<Metadata> {
    const { uid } = await params;
    return {
        title: `User Profile`,
        description: `View developer profile`,
        alternates: {
            canonical: `/u/${uid}`,
        },
        openGraph: {
            title: `DevPath User Profile`,
            description: `Check out this developer profile on DevPath`,
            url: `/u/${uid}`,
        },
    };
}

export default async function UserProfilePage({ params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    if (!uid || uid.length < 3 || uid.length > 128 || /[<>"']/.test(uid)) {
        return <ProfileClient />;
    }
    return <ProfileClient uid={uid} />;
}
