import BookingPage from 'layout/Artist/Booking';
import CustomerBookingPage from 'layout/Customer/CustomerBookingPage';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { Loading } from 'ui';

const Booking = () => {
	// Check authenticated
	const { status, data } = useSession();

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
	if (status === 'authenticated') {
		if (data.user.role === ROLE.CUSTOMER) {
			if (!data.user?.customerId) {
				return (
					<div className="flex items-center justify-center h-full">
						Bạn hãy kiểm tra hộp thư và xác thực email để thực hiện đặt hẹn nhé!
					</div>
				);
			}
			return <CustomerBookingPage customerId={data.user?.customerId} />;
		}
		if (data.user.role === ROLE.ARTIST) {
			if (!data.user?.artistId) {
				return (
					<div className="flex items-center justify-center h-full">
						Bạn hãy kiểm tra hộp thư và xác thực email để trở thành nghệ sĩ xăm chính
						thức trên hệ thống nhé!
					</div>
				);
			}
			return <BookingPage artistId={data.user?.artistId} />;
		}
	}

	Router.replace('/');
};

Booking.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar', 'dashboard']
});

export default Booking;
