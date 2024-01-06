import { Modal } from 'flowbite-react';
import { Logout } from 'icons/outline';
import StudioPage from 'layout/Studio/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BackgroundImg, Loading } from 'ui';

const Studio = () => {
	// Get artistId
	const { data, status } = useSession();
	const router = useRouter();
	const { id } = router.query;

	const [studio, setStudio] = useState(undefined);
	const [error, setError] = useState(false)

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!studio && !error) {
		fetcher(
			`${BASE_URL}/studios/studio-details?id=${id}${
				data?.user?.id ? '&accountId=' + data?.user?.id : ''
			}`
		).then((data) => {
			setStudio({
				name: data.studioName,
				address: data.address,
				phoneNumber: data.owner.phoneNumber,
				rating: data.rating,
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
		})
		.catch(() => {
			setError(true);
		});
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (error) {
		return (
			<div className="relative">
				<div className="absolute -top-3 -left-5 -right-10 h-screen">
					<BackgroundImg
						image={'/images/booking-img.jpg'}
						className="relative w-full h-full bg-center bg-cover bg-fallback"
					/>
					<div className="relative h-noFooter">
						<Modal size={'xl'} position={'center'} show={true}>
							<Modal.Body></Modal.Body>
							<div className="flex justify-center">
								<div className="flex flex-col text-center text-base pt-10">
									<div>
										<Logout height={50} width={50} />
										<h1 className="uppercase text-2xl mb-5 font-bold leading-none ">
											Art Tattoo Lover
										</h1>
									</div>
									<div className="flex-grow flex flex-col justify-center">
										<div className="pb-10">
											<div>Tiệm xăm này không tồn tại</div>
											<div>
												<Link prefetch={false} href={'/'}>
													Trở lại trang chủ
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Modal>
					</div>
				</div>
			</div>
		);
	}

	return <StudioPage studio={studio} account={data?.user} />;
};

export default Studio;
