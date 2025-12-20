import ProfileClient from './client';

export function generateStaticParams() {
    return [];
}

export default async function PublicProfilePage({ params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    return <ProfileClient uid={uid} />;
}
