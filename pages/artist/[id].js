import { Modal } from 'flowbite-react';
import ArtistPage from 'layout/Artist/Index';
import { fetcher } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BackgroundImg, Loading, Logo } from 'ui';

const Artist = () => {
	// Get artistId
	const router = useRouter();
	const { data, status } = useSession();
	const { id } = router.query;

	const [artist, setArtist] = useState(undefined);
	const [error, setError] = useState(false);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (!artist && !error) {
		fetcher(
			`${BASE_URL}/artists/${id}/artist-details${
				data?.user?.id ? `?accountId=${data?.user?.id}` : ''
			}`
		)
			.then((data) => {
				setArtist({
					fullName: data.fullName,
					id: data.id,
					avatar: data.avatar,
					bioContent: data.bioContent,
					styles: data.artistStyles,
					isVerified: data.isVerified,
					rating: data.rating,
					workAt: data.studioArtists.sort(
						(a, b) =>
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					),
					isFollow: data.isFollow
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
										<Logo height={50} width={50} />
										<h1 className="uppercase text-2xl mb-5 font-bold leading-none ">
											Art Tattoo Lover
										</h1>
									</div>
									<div className="flex-grow flex flex-col justify-center">
										<div className="pb-10">
											<div>Nghệ sĩ này không tồn tại</div>
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

	return <ArtistPage account={data?.user} artist={artist} />;
};

export default Artist;
