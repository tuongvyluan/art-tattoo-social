import BookingPage from 'layout/Artist/Booking';
import CustomerBookingPage from 'layout/Customer/CustomerBookingPage';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const Booking = () => {
	// Check authenticated
	const { status, data } = useSession();
	const [loading, setLoading] = useState(true);
	const [bookingData, setBookingData] = useState([]);
	const [customerNotVerify, setCustomerNotVerify] = useState(false);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
	if (status === 'authenticated' && data.user.role === ROLE.CUSTOMER && loading) {
		// Call api to get bookings
		if (!data.user?.customerId) {
			setCustomerNotVerify(true);
			setLoading(false);
		}
		fetcher(`${BASE_URL}/customers/${data.user.customerId}/bookings`)
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
	}

	if (!loading) {
		if (customerNotVerify) {
			return (
				<div className="flex items-center justify-center h-full">
					Bạn hãy kiểm tra hộp thư và xác thực email để thực hiện đặt hẹn nhé!
				</div>
			);
		} else {
			return <CustomerBookingPage data={bookingData} />;
		}
	} else {
		Router.replace('/');
	}
};

Booking.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default Booking;
