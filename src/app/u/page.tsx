import { redirect } from 'next/navigation';
import ProfileClient from './client';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PublicProfilePage(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const uid = searchParams.uid;

    if (uid && typeof uid === 'string') {
        redirect(`/u/${uid}`);
    }

    return <ProfileClient />;
}
