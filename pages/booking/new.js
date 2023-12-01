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
	const router = useRouter();
	const [artist, setArtist] = useState(undefined);
	const isArtist = typeof router.query.artist !== 'undefined';
	const [studio, setStudio] = useState(undefined);
	const [loading, setLoading] = useState(true);
	const artistId = router.query.artist ? router.query.artist : '';
	const [studioId, setStudioId] = useState(
		router.query.studio ? router.query.studio : ''
	);

	if (artistId === '' && studioId === '') {
		Router.replace('/');
	}

	if (loading && (status === 'loading' || !studio || (isArtist && !artist))) {
		if (isArtist && !artist) {
			fetcher(`${BASE_URL}/artists/${artistId}/artist-details`)
				.then((data) => {
					setStudioId(data.studioArtists[0].id)
					setArtist({
						firstName: data.firstName,
						lastName: data.lastName,
						id: data.id
					});
				})
				.catch((e) => {
					console.log(e)
				})
		}
		if (studioId !== '' && !studio) {
			fetcher(`${BASE_URL}/studios/${studioId}/services?pageSize=100`)
				.then((data) => {
					const newStudio = {
						id: studioId,
						services: data.services.map((service) => {
							return {
								...service,
								quantity: 0
							}
						}),
						name: 'Studio',
						avatar: ''
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
				})
		}

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
			hasLogin={status === 'authenticated'}
			isArtist={isArtist}
			artist={artist}
			studio={studio}
			customerId={data?.user?.customerId}
		/>
	);
};

NotFound.getInitialProps = async () => ({
	namespacesRequired: ['header']
});

export default BookingFormPage;
