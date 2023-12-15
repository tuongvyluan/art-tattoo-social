import CustomerPayment from 'layout/Customer/CustomerPayment';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { Loading } from 'ui';

const PaymentStatisticPage = () => {
	const { data, status } = useSession();

	if (status === 'unauthenticated') {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (data) {
		return <CustomerPayment accountId={data?.user?.id} />;
	}
};

export default PaymentStatisticPage;
