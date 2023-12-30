import MeetingSchedule from 'layout/MeetingPage';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { Loading } from 'ui';

const MeetingPage = () => {
	const { data, status } = useSession();

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'unauthenticated' || (data.user.role !== ROLE.CUSTOMER && data.user.role !== ROLE.ARTIST)) {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return <MeetingSchedule role={data?.user?.role} id={data?.user?.role === ROLE.CUSTOMER ? data.user.customerId : data.user.id} />;
};

export default MeetingPage;
