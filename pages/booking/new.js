import BookingForm from 'layout/BookingForm';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useState } from 'react';
import { Loading } from 'ui';

const BookingFormPage = () => {
	const { data, status } = useSession();
	const [artist, setArtist] = useState(undefined);
	const [isArtist, setIsArtist] = useState(true);
	const [studio, setStudio] = useState(undefined);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const artistId = router.query.artist ? router.query.artist : '';
	const studioId = router.query.studio ? router.query.studio : '';

	if (artistId === '' && studioId === '') {
		Router.replace('/');
	}
	if (studioId !== '') {
		setIsArtist(false);
	}

	if (loading && (status === 'loading' || !studio || (isArtist && !artist))) {
		if (isArtist && !artist) {
			fetcher(`${BASE_URL}/artists/${artistId}/artist-details`)
				.then((data) => {
					setArtist({
						firstName: data.firstName,
						lastName: data.lastName,
						id: data.id,
						avatar: data.avatar
					});
				})
				.catch((e) => {
					setLoading(false);
				});
		}
		const studioId = '6ceb7498-b22a-4a8c-8e4e-499189336ec2';
		fetcher(`${BASE_URL}/studios/${studioId}/services?pageSize=100`)
			.then((data) => {
				const newStudio = {
					id: studioId,
					services: data.services,
					name: 'Studio'
				};
				setStudio(newStudio);
			})
			.catch((data) => {
				const newStudio = {
					id: studioId,
					services: []
				};
				setStudio(newStudio);
			})
			.finally(() => {
				setLoading(false);
			});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!loading && (!studio || (isArtist && !artist))) {
		return NotFound();
	}

	return (
		<BookingForm
			hasLogin={typeof data.user.customerId !== 'undefined'}
			isArtist={isArtist}
			artist={artist}
			studio={studio}
			customerId={data.user.customerId}
		/>
	);
};

export default BookingFormPage;
