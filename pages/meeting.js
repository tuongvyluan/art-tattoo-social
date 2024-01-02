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

	if (
		status === 'unauthenticated' ||
		(data?.user?.role !== ROLE.CUSTOMER && data?.user?.role !== ROLE.ARTIST)
	) {
		Router.replace('/');
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return (
		<div className="relative min-h-body sm:px-8 md:px-1 lg:px-6 xl:px-56 flex flex-col">
			<div className="flex-grow relative min-w-0 p-6 rounded-lg shadow-sm mb-4 w-full bg-white dark:bg-gray-600">
				<MeetingSchedule
					role={data?.user?.role}
					id={
						data?.user?.role === ROLE.CUSTOMER ? data?.user?.customerId : data?.user?.id
					}
				/>
			</div>
		</div>
	);
};

export default MeetingPage;
