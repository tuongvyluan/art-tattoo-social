import ArtistPage from 'layout/Artist/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const Artist = () => {
	// Get artistId
	const router = useRouter();
	const { id } = router.query;

	const [artist, setArtist] = useState(undefined);

	if (!artist) {
		fetcher(`${BASE_URL}/artists/${id}/artist-details`).then((data) => {
			setArtist({
				firstName: data.firstName,
				lastName: data.lastName,
				id: data.id,
				avatar: data.avatar,
				bioContent: data.bioContent,
				styles: data.artistStyles,
				isVerified: data.isVerified,
				workAt: data.studioArtists?.at(0)?.id
			});
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return <ArtistPage artist={artist} />;
};

export default Artist;
