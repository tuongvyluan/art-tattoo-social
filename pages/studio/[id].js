import StudioPage from 'layout/Studio/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const Studio = () => {
	// Get artistId
	const { data, status } = useSession();
	const router = useRouter();
	const { id } = router.query;

	const [studio, setStudio] = useState(undefined);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!studio) {
		fetcher(`${BASE_URL}/studios/studio-details?id=${id}&accountId=${data?.user?.id}`).then((data) => {
			setStudio({
				name: data.studioName,
				address: data.address,
        phoneNumber: data.owner.phoneNumber,
				id: data.id,
				avatar: data.avatar,
				bioContent: data.bioContent,
        openTime: data.openTime,
        closeTime: data.closeTime,
				isAuthorized: data.isAuthorized,
				isPrioritized: data.isPrioritized,
        artists: data.studioArtists?.filter((a) => a.dismissedAt === null),
				interiors: data.interiors.map((i) => i.url),
				isFollow: data.isFollow ? data.isFollow : false
			});
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return <StudioPage studio={studio} account={data?.user} />;
};

export default Studio;
