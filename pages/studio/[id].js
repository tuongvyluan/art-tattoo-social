import StudioPage from 'layout/Studio/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from 'ui';

const Studio = () => {
	// Get artistId
	const router = useRouter();
	const { id } = router.query;

	const [studio, setStudio] = useState(undefined);

	if (!studio) {
		fetcher(`${BASE_URL}/studios/${id}`).then((data) => {
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
        artists: data.studioArtists,
				interiors: data.interiors.map((i) => i.url)
			});
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return <StudioPage studio={studio} />;
};

export default Studio;
