import ArtistPage from 'layout/Artist/Index';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Artist = () => {
	// Get artistId
	const router = useRouter();
	const { id } = router.query;

	const [artist, setArtist] = useState({
		id: id,
		firstName: 'Vy',
		lastName: 'Luân'
	});

	return <ArtistPage artist={artist} />;
};

export default Artist;
