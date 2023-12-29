import BookingForm from 'layout/BookingForm';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { SERVICE_STATUS } from 'lib/status';
import { sortServiceByCategory } from 'lib/studioServiceHelper';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import NotFound from 'pages/404';
import { useState } from 'react';
import { Loading } from 'ui';

const BookingFormPage = () => {
	const { data, status } = useSession();
	const router = useRouter();
	const [studio, setStudio] = useState(undefined);
	const [loading, setLoading] = useState(true);
	const [studioId, setStudioId] = useState(
		router.query.studio ? router.query.studio : ''
	);

	if (loading || status === 'loading' || !studio) {
		if (studioId !== '' && !studio) {
			fetcher(`${BASE_URL}/studios/${studioId}/services-for-create-booking`)
				.then((data) => {
					const newStudio = {
						id: studioId,
						services: data.services
							.filter((service) => service.status === SERVICE_STATUS.AVAILABLE)
							?.sort(sortServiceByCategory)
							?.map((service) => {
								return {
									...service,
									quantity: 0
								};
							}),
						name: data.studioName,
						avatar: data.owner.avatar,
						artists: data.artists,
						openTime: data.openTime,
						closeTime: data.closeTime,
						address: data.address,
						city: data.city
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
		}

		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!loading && (!studio)) {
		return NotFound();
	}

	return (
		<BookingForm
			hasLogin={status === 'authenticated'}
			studio={studio}
			customerId={data?.user?.customerId}
			role={data?.user?.role}
		/>
	);
};

NotFound.getInitialProps = async () => ({
	namespacesRequired: ['header']
});

export default BookingFormPage;
