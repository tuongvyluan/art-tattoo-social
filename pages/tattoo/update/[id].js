import TattooDetailsPage from 'layout/Artist/TattooDetailsPage';
import TattooDetailNoUpdatePage from 'layout/TattooDetailNoUpdatePage';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE, SERVICE_PLACEMENT } from 'lib/status';
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
	const back = typeof router.query['back'] !== 'undefined';
	const [id, setId] = useState(router.query.id);
	const [artTattoo, setArtTattoo] = useState(undefined);

	const handleSubmit = (newId) => {
		if (newId !== id) {
			setId(newId);
			router.replace(`/tattoo/update/${newId}`);
		}
		setArtTattoo(undefined);
	};

	if (status === 'unauthenticated') {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	// Nếu đang xem hình xăm cũ và chưa load hình xăm
	if (id !== 'new' && !artTattoo) {
		fetcher(`${BASE_URL}/TattooArts/Details?id=${id}`).then((data) => {
			const renderData = {
				...data,
				artist: {
					id: data.artistId,
					fullName: data.fullName
				},
				bookingId: data.bookingId ? data.bookingId : '',
				servicePlacement: data.bookingDetail?.servicePlacement ? data.bookingDetail.servicePlacement : 0,
				stages: data.tattooArtStages?.map((stage) => {
					return {
						...stage,
						tattooImages: stage?.tattooImages?.map((image) => {
							return {
								...image,
								saved: true
							};
						})
					};
				})
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
		if (id === 'new' && data?.user?.role === ROLE.ARTIST && !artTattoo) {
			const tattoo = {
				id: '',
				bookingId: booking,
				artist: {
					id: data?.user?.id,
					fullName: data?.user?.fullName
				},
				styleId: 14,
				servicePlacement: SERVICE_PLACEMENT.ANY,
				stages: [
					// {
					// 	id: 1,
					// 	stageStyle: 0,
					// 	description: '',
					// 	medias: [
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
			setArtTattoo(tattoo);
			return (
				<TattooDetailsPage
					bookingId={booking}
					myTattoo={back}
					artTattoo={tattoo}
					handleSubmit={handleSubmit}
				/>
			);
		}
		if (data?.user?.role !== ROLE.ARTIST || data?.user?.id !== artTattoo.artist.id) {
			return (
				<TattooDetailNoUpdatePage
					bookingId={booking}
					myTattoo={back}
					artTattoo={artTattoo}
				/>
			);
		}
		return (
			<TattooDetailsPage
				bookingId={booking}
				artTattoo={artTattoo}
				myTattoo={back}
				handleSubmit={handleSubmit}
			/>
		);
	}
};

TattooDetails.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default TattooDetails;
