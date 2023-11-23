import TattooListPage from 'layout/TattooList';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Loading } from 'ui';

const MyTattooPage = () => {
	const { data, status } = useSession();
	const [url, setUrl] = useState(undefined);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!url) {
		switch (data.user.role) {
			case ROLE.CUSTOMER:
				setUrl(`/api/tattooArt?customer=${data.user.id}`);
				break;
			case ROLE.ARTIST:
				setUrl(`/api/tattooArt?artist=${data.user.id}`);
				break;
			case ROLE.STUDIO:
				setUrl(`/api/tattooArt?studio=${data.user.id}`);
				break;
		}
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
	return <TattooListPage url={url} showFilter={false} />;
};

export default MyTattooPage;
