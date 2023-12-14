import BookingDetailsPage from 'layout/Artist/BookingDetails';
import CustomerBookingDetailPage from 'layout/Customer/CustomerBookingDetailPage';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const BookingDetails = () => {
	// Check authenticated
	const { status, data } = useSession();
	const [error, setError] = useState(false);
	const [bookingData, setBookingData] = useState(undefined);
	const [errorMessage, setErrorMessage] = useState('Tải dữ liệu thất bại.');
	const [loading, setLoading] = useState(true);

	// Get bookingId
	const router = useRouter();
	const bookingId = router.query.id;

	if (status === 'authenticated') {
		// Call api to get bookings

		if (error) {
			return (
				<div className="absolute top-0 bottom-0 flex flex-col justify-center left-0 right-0 text-lg">
					<div className='text-center'>{errorMessage}</div>
					<Link href='/booking'>
						<div className='text-center cursor-pointer text-blue-500'>Trở lại đơn hàng</div>
					</Link>
				</div>
			);
		}

		if (
			(data.user.role === ROLE.CUSTOMER || data.user.role === ROLE.ARTIST) &&
			loading &&
			!error
		) {
			fetcher(`${BASE_URL}/bookings/get-by-id?bookingId=${bookingId}`)
				.then((res) => {
					let bookingDetails = res.bookingDetails;
					if (
						data.user.role === ROLE.CUSTOMER &&
						res.customer?.accountId !== data.user.id
					) {
						setErrorMessage('Bạn không có quyền xem chi tiết đơn hàng này');
						setError(true);
					}
					if (data.user.role === ROLE.ARTIST) {
						bookingDetails = res.bookingDetails?.filter(
							(b) => b.artist?.id === data.user.id
						);
						if (bookingDetails.length === 0) {
							setErrorMessage('Bạn không có quyền xem chi tiết đơn hàng này');
							setError(true);
						}
					}
					setBookingData({
						...res,
						bookingDetails: bookingDetails
					});
					setLoading(false);
				})
				.catch((e) => {
					setError(true);
				});
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		}
		if (data.user.role === ROLE.CUSTOMER) {
			return (
				<CustomerBookingDetailPage
					setLoading={setLoading}
					data={bookingData}
					studioId={bookingData.studioId}
				/>
			);
		}
		if (data.user.role === ROLE.ARTIST) {
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

	if (status === 'loading' || (loading && !error)) {
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
