import TattooListNotFilter from 'layout/TattooListNotFilter';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const FavoritePage = () => {
	const { data, status } = useSession();
	const [url, setUrl] = useState(undefined);
	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}
	if (status === 'authenticated') {
		if (!url) {
			setUrl(`${BASE_URL}/Media/GetLikeList?userId=${data.user.id}`);
			return (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			);
		} else return <TattooListNotFilter url={url} pageSize={20} />;
	} else {
		Router.replace('/');
	}
};

export default FavoritePage;
