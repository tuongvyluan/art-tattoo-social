import ArtistPage from 'layout/Artist/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const Artist = () => {
	// Get artistId
	const router = useRouter();
	const { data, status } = useSession();
	const { id } = router.query;

	const [artist, setArtist] = useState(undefined);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!artist) {
		fetcher(
			`${BASE_URL}/artists/${id}/artist-details${
				data?.user?.id ? `?accountId=${data.user.id}` : ''
			}`
		).then((data) => {
			setArtist({
				fullName: data.fullName,
				id: data.id,
				avatar: data.avatar,
				bioContent: data.bioContent,
				styles: data.artistStyles,
				isVerified: data.isVerified,
				workAt: data.studioArtists?.at(0),
				isFollow: data.isFollow
			});
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return <ArtistPage accountId={data?.user?.id} artist={artist} />;
};

export default Artist;
