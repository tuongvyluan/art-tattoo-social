import Button from 'components/Button';
import { ChevronDown, ChevronUp } from 'icons/outline';
import TattooListNotFilter from 'layout/TattooListNotFilter';
import { formatPhoneNumber } from 'lib';
import { BASE_URL } from 'lib/env';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiClock, FiHome, FiPhone } from 'react-icons/fi';
import { Avatar, Card, CardBody } from 'ui';
import { TattooArtCarousel } from 'ui/TattooArtCarousel';

const StudioPage = ({ studio }) => {
	const { data } = useSession();
	const [showMoreInfo, setShowMoreInfo] = useState(false);

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
										src={studio.avatar ? studio.avatar : '/images/avatar.png'}
										alt={studio.name}
									/>
								</div>
							</div>
							<div className="cursor-pointer">
								<div className="font-semibold text-base">{studio.name}</div>
							</div>
						</div>
						<div className="pb-6 flex justify-center flex-wrap gap-2 w-full">
							{data?.user?.customerId && (
								<div className="w-20">
									<a target="_blank" href={`/booking/new?studio=${studio.id}`}>
										<Button>Đặt hẹn</Button>
									</a>
								</div>
							)}
							<div className="w-20">
								<Button outline>Theo dõi</Button>
							</div>
						</div>
						{
							// Show more info
						}
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
						<div className={`${showMoreInfo ? 'block' : 'hidden'}`}>
							<div className="pb-5 border-b border-gray-300">
								<h1 className="font-semibold text-base pb-2">Bio</h1>
								<div>{studio.bioContent}</div>
							</div>
						</div>
					</CardBody>
				</Card>
				<div className="hidden md:flex gap-7">
					<Card className={'max-w-min'}>
						<CardBody className={'px-4 lg:px-10 xl:px-20'}>
							<div className="mx-auto text-center pb-4">
								<div className="cursor-pointer text-center w-max mx-auto">
									<div>
										<Avatar
											size={200}
											src={studio.avatar ? studio.avatar : '/images/avatar.png'}
											alt={studio.name}
										/>
									</div>
								</div>
								<div className="cursor-pointer">
									<div className="font-semibold text-lg pt-4">{studio.name}</div>
								</div>
							</div>
							<div className="pb-3 flex justify-center flex-wrap gap-2 w-full min-w-max">
								{data?.user?.customerId && (
									<div className="w-20">
										<a target="_blank" href={`/booking/new?studio=${studio.id}`}>
											<Button>Đặt hẹn</Button>
										</a>
									</div>
								)}
								<div className="w-20">
									<Button outline>Theo dõi</Button>
								</div>
							</div>
						</CardBody>
					</Card>
					<Card>
						<CardBody>
							<div className={`block`}>
								<div className="pb-5">
									<div className="flex gap-2 py-2 text-base items-center">
										<div>
											<FiHome size={20} />
										</div>
										<div>{studio.address}</div>
									</div>
									<div className="flex gap-2 py-2 text-base items-center">
										<div>
											<FiPhone size={20} />
										</div>
										<div>{formatPhoneNumber(studio.phoneNumber)}</div>
									</div>
									<div className="flex gap-2 py-2 text-base items-center">
										<div>
											<FiClock size={20} />
										</div>
										<div>
											{studio.openTime.split(':')[0]}:{studio.openTime.split(':')[1]}{' '}
											- {studio.closeTime.split(':')[0]}:
											{studio.closeTime.split(':')[1]}
										</div>
									</div>
									<h1 className="font-semibold text-base pb-2">Bio</h1>
									<div>{studio.bioContent}</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
			{
				// Artist
			}
			{studio.artists?.length > 0 && (
				<div>
					<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
						Nghệ sĩ xăm
					</div>
					<div className="w-full lg:px-20 xl:px-44 2xl:px-56">
						<Card>
							<CardBody>
								<div className="overflow-x-auto">
									<div className="flex justify-center gap-2 items-center">
										{studio.artists?.map((artist) => (
											<div className="w-40" key={artist.id}>
												<Link href={`/artist/${artist.artist.id}`}>
													<div className="mx-auto w-max cursor-pointer">
														<div className="flex justify-center">
															<Avatar
																size={80}
																src={
																	artist?.artist?.avatar
																		? artist.artist.avatar
																		: '/images/ATL.png'
																}
															/>
														</div>
														<div className="text-center pt-2">
															{artist?.artist?.fullName}
														</div>
													</div>
												</Link>
											</div>
										))}
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			)}
			{studio.interiors?.length > 0 && (
				<div className="xl:px-32 pb-5">
					<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
						Cơ sở vật chất
					</div>
					<TattooArtCarousel imageHeight={600} images={studio.interiors} />
				</div>
			)}

			<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
				Tác phẩm
			</div>
			<TattooListNotFilter
				url={`${BASE_URL}/TattooArts/TattooUser?studioId=${studio.id}`}
				pageSize={12}
			/>
		</div>
	);
};

StudioPage.propTypes = {
	studio: PropTypes.object.isRequired
};

export default StudioPage;
