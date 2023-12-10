import TattooListPage from 'layout/TattooList';
import TattooSocial from 'layout/TattooSocial';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Loading } from 'ui';

const TattooDetails = () => {
	// Get tattooId
	const router = useRouter();
	const [id, setId] = useState(router.query.id);
	const [artTattoo, setArtTattoo] = useState(undefined);
	const [artist, setArtist] = useState({
		id: [Math.floor(Math.random() * 900)],
		fullName: 'Vy Luân'
	});
	const [tattooImages, setTattooImages] = useState([]);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);

	useEffect(() => {
		setLikes([]);
		setComments([]);
		fetcher(
			`${BASE_URL}/TattooArts/GetTattooArtMediaById?id=${router.query.id}&isAll=false`
		).then((data) => {
			setArtTattoo({
				id: data.id,
				style: data.style,
				placement: {
					id: data.placement,
					name: data.placementName
				},
				size: data.size,
				description: data.description,
				doneAt: {
					id: data.studio.id,
					avatar: data.studio.avatar,
					name: data.studio.studioName
				}
			});
			setArtist({
				...artist,
				id: data.artistId,
				avatar: data.avatar,
				fullName: data.artist.fullName,
				isVerified: data.artist?.isVerified ? data.artist.isVerified : false,
				workAt: {
					id: data.studioWorkedAtId,
					name: data.nameStudioWorkedAtId
				}
			});
			setLikes(data.likes);
			setComments(data.comments);
			setTattooImages([{ url: data.thumbnail }].concat(data.tattooImages));
			// setArtist(data.artist);
		});
	}, [router.query.id]);

	if (!artTattoo) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	} else
		return (
			<div key={id}>
				{
					// Tattoo art carousel and post interactions
				}
				<TattooSocial
					likes={likes}
					comments={comments}
					tattoo={artTattoo}
					artist={artist}
					tattooImages={tattooImages}
				/>
				{
					// More tattoo arts
				}
				<div>
					<TattooListPage
						url={`${BASE_URL}/TattooArts/AllTattooArts`}
						pageSize={12}
					/>
				</div>
			</div>
		);
};

TattooDetails.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

TattooListPage.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

export default TattooDetails;
