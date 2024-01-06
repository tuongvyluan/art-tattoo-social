import Button from 'components/Button';
import MyRating from 'components/MyRating';
import Pill from 'components/Pill';
import { ChevronDown, ChevronUp } from 'icons/outline';
import { fetcherPut, formatDate } from 'lib';
import { BASE_URL } from 'lib/env';
import Link from 'next/link';
import PropTypes from 'propTypes';
import { useState } from 'react';
import { Avatar, Card, CardBody } from 'ui';

const ArtistIndexProfileSection = ({ artist }) => {
	const [showMoreInfo, setShowMoreInfo] = useState(false);
	const [isFollowed, setIsFollowed] = useState(artist.isFollow);

	const handleFollow = () => {
		if (isFollowed) {
			fetcherPut(
				`${BASE_URL}/follow/unfollow-artist?accountId=${account?.id}&artistId=${artist.id}`
			).catch(() => {
				setIsFollowed(false);
			});
		} else {
			fetcherPut(
				`${BASE_URL}/follow/follow-artist?accountId=${account?.id}&artistId=${artist.id}`
			).catch(() => {
				setIsFollowed(true);
			});
		}
	};

	return (
		<div className="w-full lg:px-20 xl:px-44 2xl:px-56">
			<Card className={'block md:hidden'}>
				<CardBody>
					<div className="mx-auto text-center pb-2">
						<div className="cursor-pointer text-center w-max mx-auto">
							<div>
								<Avatar
									size={60}
									src={artist.avatar ? artist.avatar : '/images/avatar.png'}
									alt={artist.fullName}
								/>
							</div>
						</div>
						<div className="cursor-pointer">
							<div className="font-semibold text-base">{artist.fullName}</div>
							<div className="flex flex-wrap justify-center gap-2 items-center text-base">
								<MyRating
									allowFraction={true}
									readonly={true}
									rating={artist.rating !== null ? artist.rating : 0}
								/>
								<div>
									{artist.rating
										? `Đánh giá: ${artist.rating}/5`
										: 'Chưa có đánh giá'}
								</div>
							</div>
						</div>
					</div>
					<div className="pb-6 flex justify-center flex-wrap gap-2 w-full">
						{artist.workAt && account?.customerId && (
							<div className="w-20">
								<Link
									prefetch={false}
									target="_blank"
									href={`/booking/new?studio=${artist.workAt?.at(0)?.id}`}
								>
									<Button>Đặt hẹn</Button>
								</Link>
							</div>
						)}
						{account?.id && (
							<div onClick={handleFollow} className="w-24">
								<Button outline>{isFollowed ? 'Bỏ theo dõi' : 'Theo dõi'}</Button>
							</div>
						)}
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
							<h1 className="font-semibold text-base pb-2">Giới thiệu</h1>
							<div>
								{artist.bioContent?.trim().length > 0
									? artist.bioContent?.trim()
									: 'Chưa có giới thiệu'}
							</div>
						</div>
						{artist.workAt?.length > 0 && (
							<div className="pb-5 border-b border-gray-300 pt-3">
								<h1 className="font-semibold text-base pb-2">Tiệm xăm</h1>
								{artist.workAt.map((studioArtist) => (
									<Link
										prefetch={false}
										href={`/studio/${studioArtist?.id}`}
										key={studioArtist?.createdAt}
									>
										<div className="flex flex-wrap gap-2 items-center pb-3 cursor-pointer">
											<Avatar
												size={50}
												src={
													studioArtist?.studioAvatar
														? studioArtist?.studioAvatar
														: '/images/ATL.png'
												}
											/>
											<div>
												<div className="text-base font-semibold">
													{studioArtist?.studioName}
												</div>
												<div>
													Từ {formatDate(studioArtist?.createdAt)} đến{' '}
													{studioArtist?.dismissedAt
														? `${formatDate(studioArtist?.dismissedAt)}`
														: 'nay'}
												</div>
											</div>
										</div>
									</Link>
								))}
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
				className={`hidden md:flex md:justify-center gap-3 ${
					artist.bio || artist.workAt || artist.styles.at(0) ? '' : 'justify-center'
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
										alt={artist.fullName}
									/>
								</div>
							</div>
							<div className="cursor-pointer">
								<div className="font-semibold text-base">{artist.fullName}</div>
								<div className="flex flex-wrap justify-center gap-2 items-center text-base">
									<MyRating
										allowFraction={true}
										readonly={true}
										rating={artist.rating ? artist.rating : 0}
									/>
									<div>
										{artist.rating !== null
											? `Đánh giá: ${artist.rating}/5`
											: 'Chưa có đánh giá'}
									</div>
								</div>
							</div>
						</div>
						<div className="pb-3 flex justify-center flex-wrap gap-2 w-full min-w-max">
							{artist.workAt && account?.customerId && (
								<div className="w-20">
									<Link
										prefetch={false}
										target="_blank"
										href={`/booking/new?studio=${artist.workAt?.at(0)?.id}`}
									>
										<Button>Đặt hẹn</Button>
									</Link>
								</div>
							)}
							{account?.id && (
								<div onClick={handleFollow} className="w-24">
									<Button outline>{isFollowed ? 'Bỏ theo dõi' : 'Theo dõi'}</Button>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
				{(artist.bio || artist.workAt?.length > 0 || artist.styles?.length > 0) && (
					<Card>
						<CardBody>
							<div className={`block`}>
								<div className="pb-5 border-b border-gray-300">
									<h1 className="font-semibold text-base pb-2">Giới thiệu</h1>
									<div>
										{artist.bioContent?.trim().length > 0
											? artist.bioContent?.trim()
											: 'Chưa có giới thiệu'}
									</div>
								</div>
								{artist.workAt?.length > 0 && (
									<div className="pb-5 border-b border-gray-300 pt-3">
										<h1 className="font-semibold text-base pb-2">Tiệm xăm</h1>
										{artist.workAt.map((studioArtist) => (
											<Link
												prefetch={false}
												href={`/studio/${studioArtist?.id}`}
												key={studioArtist?.createdAt}
											>
												<div className="flex flex-wrap gap-2 items-center pb-3 cursor-pointer">
													<Avatar
														size={50}
														src={
															studioArtist?.studioAvatar
																? studioArtist?.studioAvatar
																: '/images/ATL.png'
														}
													/>
													<div>
														<div className="text-base font-semibold">
															{studioArtist?.studioName}
														</div>
														<div>
															Từ {formatDate(studioArtist?.createdAt)} đến{' '}
															{studioArtist?.dismissedAt
																? `${formatDate(studioArtist?.dismissedAt)}`
																: 'nay'}
														</div>
													</div>
												</div>
											</Link>
										))}
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
	);
};

ArtistIndexProfileSection.propTypes = {
	artist: PropTypes.object
};

export default ArtistIndexProfileSection;
