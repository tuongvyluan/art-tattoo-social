import TattooListPage from 'layout/TattooList';
import TattooSocial from 'layout/TattooSocial';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { tattooStyleById } from 'lib/tattooStyle';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const TattooDetails = () => {
	// Get bookingId
	const router = useRouter();
	const { id } = router.query;
	const [artTattoo, setArtTattoo] = useState(undefined);
	const [artist, setArtist] = useState({
		artistId: [Math.floor(Math.random() * 900)],
		firstName: 'Vy',
		lastName: 'Luân'
	});
	const [medias, setMedias] = useState([]);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);

	if (!artTattoo) {
		fetcher(`${BASE_URL}/TattooArts/GetTattooArtMediaById?id=${id}`).then((data) => {
			setArtTattoo({
				id: data.id,
				style: tattooStyleById(data.styleId),
				placement: {
					id: data.placement,
					name: data.placementName
				},
				size: data.size,
				description: data.description
			});
			setLikes(data.likes);
			setComments(data.comments);
			setMedias(data.medias);
			// setArtist(data.artist);
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	} else
		return (
			<div>
				{
					// Tattoo art carousel and post interactions
				}
				<TattooSocial
					likes={likes}
					comments={comments}
					tattoo={artTattoo}
					artist={artist}
					medias={medias}
				/>
				{
					// More tattoo arts
				}
				<TattooListPage />
			</div>
		);
};

export default TattooDetails;
