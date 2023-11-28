import Button from 'components/Button';
import { ChevronDown, ChevronUp } from 'icons/outline';
import TattooListNotFilter from 'layout/TattooListNotFilter';
import { formatDateTime, formatPhoneNumber, formatTime } from 'lib';
import { BASE_URL } from 'lib/env';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FiClock, FiHome, FiPhone } from 'react-icons/fi';
import { Avatar, Card, CardBody } from 'ui';

const StudioPage = ({ studio }) => {
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
							{
								<div className="w-20">
									<a target="_blank" href={`/booking/new?artist=${studio.id}`}>
										<Button>Đặt hẹn</Button>
									</a>
								</div>
							}
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
				<div className="hidden md:flex gap-3">
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
								{
									<div className="w-20">
										<a target="_blank" href={`/booking/new?studio=${studio.id}`}>
											<Button>Đặt hẹn</Button>
										</a>
									</div>
								}
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
									<div className='flex gap-2 py-2 text-base items-center'>
                    <div>
                      <FiHome size={20} />
                    </div>
										<div>
											{studio.address}
										</div>
									</div>
									<div className='flex gap-2 py-2 text-base items-center'>
                    <div>
                      <FiPhone size={20} />
                    </div>
										<div>
											{formatPhoneNumber(studio.phoneNumber)}
										</div>
									</div>
									<div className='flex gap-2 py-2 text-base items-center'>
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
			<div className="hidden md:block pb-5 pt-0 text-center text-3xl text-gray-700">
				Tác phẩm
			</div>
			{/* <TattooListNotFilter
				url={`${BASE_URL}/TattooArts/TattooUser?artistId=${studio.id}`}
				pageSize={12}
			/> */}
		</div>
	);
};

StudioPage.propTypes = {
	artist: PropTypes.object.isRequired
};

export default StudioPage;
