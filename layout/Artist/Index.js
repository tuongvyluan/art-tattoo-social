import Button from 'components/Button';
import Pill from 'components/Pill';
import { Tooltip } from 'flowbite-react';
import { ChevronDown, ChevronUp } from 'icons/outline';
import TattooListNotFilter from 'layout/TattooListNotFilter';
import { fetcherPut } from 'lib';
import { BASE_URL } from 'lib/env';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Avatar, Card, CardBody } from 'ui';

const ArtistPage = ({ artist, accountId }) => {
	const [showMoreInfo, setShowMoreInfo] = useState(false);
	const [isFollowed, setIsFollowed] = useState(artist.isFollow);

	const handleFollow = () => {
		if (accountId) {
			if (isFollowed) {
				fetcherPut(
					`${BASE_URL}/follow/unfollow-artist?accountId=${accountId}&artistId=${artist.id}`
				);
				setIsFollowed(false);
			} else {
				fetcherPut(
					`${BASE_URL}/follow/follow-artist?accountId=${accountId}&artistId=${artist.id}`
				);
				setIsFollowed(true);
			}
		} else {
			window.open('/auth/signin', 'blank');
		}
	};

	return (
		<div className="relative">
			{
				// Artist profile
			}
			<div className="w-full lg:px-20 xl:px-44 2xl:px-56">
				<Card className={'block md:hidden'}>
					<CardBody>
						<div className="mx-auto text-center pb-2">
							<div className="cursor-pointer text-center w-max mx-auto">
								<div>
									<Avatar
										size={60}
										src={artist.avatar ? artist.avatar : '/images/avatar.png'}
										alt={artist.firstName}
									/>
								</div>
							</div>
							<div className="cursor-pointer">
								<div className="font-semibold text-base">
									{artist.firstName} {artist.lastName}
								</div>
							</div>
						</div>
						<div className="pb-6 flex justify-center flex-wrap gap-2 w-full">
							{artist.isVerified && artist.workAt && (
								<div className="w-20">
									<a target="_blank" href={`/booking/new?artist=${artist.id}`}>
										<Button>Đặt hẹn</Button>
									</a>
								</div>
							)}
							<div onClick={handleFollow} className="w-24">
								<Button outline>{isFollowed ? 'Bỏ theo dõi' : 'Theo dõi'}</Button>
							</div>
						</div>
						{
							// Show more info
						}
						{(artist.bio || artist.workAt || artist.styles.at(0)) && (
							<div
								onClick={() => setShowMoreInfo(!showMoreInfo)}
								className="block text-center"
							>
								<div className="mx-auto text-base cursor-pointer text-gray-700">
									{showMoreInfo ? 'Ẩn bớt' : 'Xem thêm'}
								</div>
								<div className="mx-auto w-max text-center cursor-pointer text-gray-700 pb-3">
									{showMoreInfo ? (
										<ChevronUp width={20} height={20} />
									) : (
										<ChevronDown width={20} height={20} />
									)}
								</div>
							</div>
						)}

						<div className={`${showMoreInfo ? 'block' : 'hidden'}`}>
							<div className="pb-5 border-b border-gray-300">
								<h1 className="font-semibold text-base pb-2">Bio</h1>
								<div>{artist.bioContent}</div>
							</div>
							{artist.workAt && (
								<div className="pb-5 border-b border-gray-300 pt-3">
									<h1 className="font-semibold text-base pb-2">Tiệm xăm</h1>
									<div className="flex gap-4 items-center">
										<Avatar
											size={44}
											src={
												artist.workAt?.avatar
													? artist.workAt?.avatar
													: '/images/ATL.png'
											}
											alt="studio logo"
										/>
										<div>
											<div className="font-semibold">
												{artist.workAt?.studioName}
											</div>
										</div>
									</div>
								</div>
							)}
							{artist.styles && (
								<div className="py-3">
									<h1 className="font-semibold text-base pb-2">Styles</h1>
									<div className="flex gap-4 items-center"></div>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
				<div
					className={`hidden md:flex gap-3 ${
						artist.bio || artist.workAt || artist.styles.at(0)
							? ''
							: 'justify-center'
					}`}
				>
					<Card className={'max-w-min'}>
						<CardBody className={'px-4 lg:px-10 xl:px-20'}>
							<div className="mx-auto text-center pb-4">
								<div className="cursor-pointer text-center w-max mx-auto">
									<div>
										<Avatar
											size={200}
											src={artist.avatar ? artist.avatar : '/images/avatar.png'}
											alt={artist.firstName}
										/>
									</div>
								</div>
								<div className="cursor-pointer">
									<div className="font-semibold text-lg pt-4">
										{artist.firstName} {artist.lastName}
									</div>
								</div>
							</div>
							<div className="pb-3 flex justify-center flex-wrap gap-2 w-full min-w-max">
								{artist.isVerified && artist.workAt && (
									<div className="w-20">
										<a target="_blank" href={`/booking/new?artist=${artist.id}`}>
											<Button>Đặt hẹn</Button>
										</a>
									</div>
								)}
								<div onClick={handleFollow} className="w-24">
									<Button outline>{isFollowed ? 'Bỏ theo dõi' : 'Theo dõi'}</Button>
								</div>
							</div>
						</CardBody>
					</Card>
					{(artist.bio || artist.workAt || artist.styles.at(0)) && (
						<Card>
							<CardBody>
								<div className={`block`}>
									<div className="pb-5 border-b border-gray-300">
										<h1 className="font-semibold text-base pb-2">Bio</h1>
										<div>{artist.bioContent}</div>
									</div>
									{artist.workAt && (
										<div className="pb-5 border-b border-gray-300 pt-3">
											<h1 className="font-semibold text-base pb-2">Tiệm xăm</h1>
											<Link href={`/studio/${artist.workAt.id}`}>
												<div className="flex gap-4 items-center cursor-pointer">
													<Avatar
														size={44}
														src={
															artist.workAt?.avatar
																? artist.workAt?.avatar
																: '/images/ATL.png'
														}
														alt="studio logo"
													/>
													<div>
														<div className="font-semibold">
															{artist.workAt?.studioName}
														</div>
													</div>
												</div>
											</Link>
										</div>
									)}
									{artist.styles.at(0) && (
										<div className="py-3">
											<h1 className="font-semibold text-base pb-2">Styles</h1>
											<div className="flex flex-wrap gap-4 items-center">
												{artist.styles.map((style, index) => (
													<div className="" key={style.id}>
														<Pill>{style.name}</Pill>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</CardBody>
						</Card>
					)}
				</div>
			</div>
			<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
				Tác phẩm
			</div>
			<TattooListNotFilter
				url={`${BASE_URL}/TattooArts/TattooUser?artistId=${artist.id}`}
				pageSize={12}
			/>
		</div>
	);
};

ArtistPage.propTypes = {
	artist: PropTypes.object.isRequired,
	accountId: PropTypes.string
};

export default ArtistPage;
