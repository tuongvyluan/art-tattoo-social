import PaymentBooking from 'layout/Customer/PaymentBooking';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import { Loading } from 'ui';

const PaymentPage = () => {
	const router = useRouter();
	const bookingId = router.query.id;
	const { data, error } = useSWR(`${BASE_URL}/transactions/${bookingId}`);
	const [myError, setMyError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('Tải dữ liệu thất bại');
	const { data: userData } = useSession();
	if (error || myError) {
		return (
			<div className="absolute top-0 bottom-0 flex flex-col justify-center left-0 right-0 text-lg">
				<div className="text-center">{errorMessage}</div>
				<Link prefetch={false} href="/">
					<div className="text-center cursor-pointer text-blue-500">
						Trở lại trang chủ
					</div>
				</Link>
			</div>
		);
	}
	if (data) {
		if (data.customer?.accountId === userData?.user?.id) {
			return <PaymentBooking booking={data} />;
		} else {
			setErrorMessage('Bạn không có quyền xem giao dịch chi tiết của đơn hàng này');
			setMyError(true);
		}
	}
	return (
		<div className="flex items-center justify-center h-full">
			<Loading />
		</div>
	);
};

export default PaymentPage;
