import ProfileClient from '../client';

type Params = Promise<{ uid: string }>;

export default async function PublicProfilePage(props: { params: Params }) {
    const params = await props.params;
    const uid = params.uid;

    return <ProfileClient uid={uid} />;
}
