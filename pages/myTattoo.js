import ArtistMyTattooPage from 'layout/Artist/MyTattoo';
import TattooListUpdate from 'layout/TattooListUpdate';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
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

	if (status === 'unauthenticated') {
		Router.replace('/');
	} else if (!url) {
		switch (data.user.role) {
			case ROLE.CUSTOMER:
				setUrl(`${BASE_URL}/TattooArts/TattooUser?customerId=${data.user.customerId}&accountId=${data.user.id}`);
				break;
			case ROLE.ARTIST:
				setUrl(`${BASE_URL}/TattooArts/TattooUser?artistId=${data.user.id}&accountId=${data.user.id}`);
				break;
			case ROLE.STUDIO:
				setUrl(`${BASE_URL}/TattooArts/TattooUser?studioId=${data.user.studioId}`);
				break;
		}
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (data.user.role !== ROLE.ARTIST) {
		return (
			<TattooListUpdate role={data.user.role} url={url} showFilter={false} />
		);
	}
	return <ArtistMyTattooPage url={url} />;
};

export default MyTattooPage;
