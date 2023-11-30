import BookingDetailsPage from 'layout/Artist/BookingDetails';
import CustomerBookingDetailPage from 'layout/Customer/CustomerBookingDetailPage';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const BookingDetails = () => {
	// Check authenticated
	const { status, data } = useSession();
	const [loading, setLoading] = useState(true);
	const [bookingData, setBookingData] = useState(undefined);

	// Get bookingId
	const router = useRouter();
	const bookingId = router.query.id;

	if (status === 'authenticated') {
		// Call api to get bookings

		if (
			(data.user.role === ROLE.CUSTOMER || data.user.role === ROLE.ARTIST) &&
			loading
		) {
			fetcher(`${BASE_URL}/bookings/${bookingId}/details-studio`)
				.then((data) => {
					setBookingData(data);
					setLoading(false);
				})
				.catch((e) => {
					return (
						<div className="flex items-center justify-center h-full">
							Failed to load data
						</div>
					);
				});
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		} else {
			if (data.user.role === ROLE.CUSTOMER) {
				return (
					<CustomerBookingDetailPage
						setLoading={setLoading}
						data={bookingData}
						studioId={bookingData.studioId}
					/>
				);
			}
			return (
				<BookingDetailsPage
					setLoading={setLoading}
					data={bookingData}
					studioId={bookingData.studioId}
					artistId={data.user.artistId}
				/>
			);
		}
	}

	if (status === 'loading' || loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
	if (status === 'unauthenticated') {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
};

BookingDetails.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default BookingDetails;
