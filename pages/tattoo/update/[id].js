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
	const [id, setId] = useState(router.query.id);
	const [artTattoo, setArtTattoo] = useState(undefined);

	const handleSubmit = (newId) => {
		if (newId !== id) {
			setId(newId)
			router.replace(`/tattoo/update/${newId}`)
		}
		setArtTattoo(undefined)
	};

	if (status === 'unauthenticated') {
		Router.replace('/')
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	// Nếu đang xem hình xăm cũ và chưa load hình xăm
	if (id !== 'new' && !artTattoo) {
		fetcher(`${BASE_URL}/TattooArts/Details?id=${id}`).then((data) => {
			const stageMap = new Map(
				data.tattooImages.map((obj) => {
					return [
						obj.tattooArtStageId,
						{
							id: obj.tattooArtStageId,
							stageStyle: obj.stageStyle,
							description: obj.description ? obj.description : '',
							tattooImages: []
						}
					];
				})
			);
			data.tattooImages.map((obj) => {
				const value = stageMap.get(obj.tattooArtStageId);
				value.tattooImages.push({ ...obj, saved: true }); // saved field to note that this image has been saved to db
				stageMap.set(obj.tattooArtStageId, value);
			});
			const renderData = {
				...data,
				artist: {
					id: data.artistId,
					fullName: data.fullName
				},
				bookingId: data.bookingId ? data.bookingId : '',
				stages: Array.from(stageMap, ([id, value]) => value)
			};
			setArtTattoo(renderData);
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
		if (id !== 'new' && !artTattoo) {
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		}
		if (id === 'new' && data.user.role === ROLE.ARTIST && !artTattoo) {

			const tattoo = {
				id: '',
				bookingId: booking,
				artist: {
					id: data.user.id,
					fullName: data.user.fullName
				},
				styleId: 14,
				stages: [
					// {
					// 	id: 1,
					// 	stageStyle: 0,
					// 	description: '',
					// 	tattooImages: [
							// {
							// id: '',
							// url: '',
							// description: '',
							// isPublicized: false
							// }
					// 	]
					// }
				],
				thumbnail: '',
				isPublicized: false,
				size: 0,
				placement: 0
			};
			setArtTattoo(tattoo)
			return (
				<TattooDetailsPage
					bookingId={booking}
					artTattoo={tattoo}
					handleSubmit={handleSubmit}
				/>
			);
		}
		if (data.user.role !== ROLE.ARTIST || data.user.id !== artTattoo.artist.id) {
			return (
				<TattooDetailNoUpdatePage
					bookingId={booking}
					artTattoo={artTattoo}
				/>
			);
		}
		return (
			<TattooDetailsPage
				bookingId={booking}
				artTattoo={artTattoo}
				handleSubmit={handleSubmit}
			/>
		)
	}
};

TattooDetails.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default TattooDetails;
