import TattooDetailsPage from 'layout/Artist/TattooDetailsPage';
import TattooDetailNoUpdatePage from 'layout/TattooDetailNoUpdatePage';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const TattooDetails = () => {
	// Check authenticated
	const { status, data } = useSession();
	const router = useRouter();
	const booking =
		typeof router.query['booking'] !== 'undefined' ? router.query['booking'] : '';
	const { id } = router.query;
	const [artTattoo, setArtTattoo] = useState(undefined);
	const [artist, setArtist] = useState({
		artistId: [Math.floor(Math.random() * 900)],
		firstName: 'Vy'
	});

	const handleSubmit = (newArtTattoo) => {
		setArtTattoo(newArtTattoo);
	};

	// Nếu đang xem hình xăm cũ và chưa load hình xăm
	if (id !== 'new' && !artTattoo) {
		fetcher(`${BASE_URL}/TattooArts/Details?id=${id}`).then((data) => {
			const stageMap = new Map(
				data.medias.map((obj) => {
					return [
						obj.tattooArtStageId,
						{
							id: obj.tattooArtStageId,
							name: obj.stageName,
							description: obj.description ? obj.description : '',
							medias: []
						}
					];
				})
			);
			data.medias.map((obj) => {
				const value = stageMap.get(obj.tattooArtStageId);
				value.medias.push({ ...obj, saved: true }); // saved field to note that this image has been saved to db
				stageMap.set(obj.tattooArtStageId, value);
			});
			const renderData = {
				...data,
				artist: {
					id: data.artistId,
					firstName: data.firstName,
					lastName: data.lastName
				},
				bookingId: data.bookingId ? data.bookingId : '',
				stages: Array.from(stageMap, ([id, value]) => value)
			};
			if (renderData.stages.length === 0) {
				renderData.stages.push({
					id: 1,
					stageStyle: 0,
					description: '',
					medias: []
				});
			}
			setArtTattoo(renderData);
			setArtist(renderData.artist);
		});
	}

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'authenticated') {
		if (id !== 'new' && (!artTattoo || !artist)) {
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		}
		if (id === 'new' && data.user.role === ROLE.ARTIST) {
			const artistInfo = {
				id: data.user.id,
				firstName: data.user.firstName,
				lastName: data.user.lastName
			};
			return (
				<TattooDetailsPage
					bookingId={booking}
					artTattoo={artTattoo}
					artist={artistInfo}
					handleSubmit={handleSubmit}
				/>
			);
		}
		if (data.user.role !== ROLE.ARTIST) {
			return (
				<TattooDetailNoUpdatePage
					bookingId={booking}
					artTattoo={artTattoo}
					artist={artist}
				/>
			);
		}
		return (
			<TattooDetailsPage
				bookingId={booking}
				artTattoo={artTattoo}
				artist={artist}
				handleSubmit={handleSubmit}
			/>
		);
	} else {
		Router.replace('/');
	}
};

TattooDetails.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default TattooDetails;
