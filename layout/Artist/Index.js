import Button from 'components/Button';
import { ChevronDown, ChevronUp } from 'icons/outline';
import { usePaginate } from 'lib/usePagination';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Avatar, Card, CardBody } from 'ui';
const ArtistPage = ({ artist }) => {
	const { items, error, size, setSize, isReachingEnd } = usePaginate(
		'/api/tattooArt',
		20
	);
	const [showMoreInfo, setShowMoreInfo] = useState(false);

	return (
		<div className="relative lg:flex lg:gap-4">
			{
				// Artist profile
			}
			<div className="w-full lg:w-72">
				<Card>
					<CardBody>
						<div className="mx-auto text-center lg:mx-0 lg:text-left lg:flex lg:gap-3 lg:items-center pb-2">
							<div className="cursor-pointer text-center w-max mx-auto lg:mx-0">
								<Avatar
									size={60}
									src={artist.avatar ? artist.avatar : '/images/avatar.png'}
									alt={artist.firstName}
								/>
							</div>
							<div className="cursor-pointer">
								<div className="font-semibold text-base">
									{artist.firstName} {artist.lastName}
								</div>
								<div className="text-gray-700">200 người theo dõi</div>
							</div>
						</div>
						<div className="pb-3 flex justify-center flex-wrap gap-2 w-full">
							<div className="w-20">
								<a target="_blank" href={`/booking/new?artist=${artist.id}`}>
									<Button>Đặt hẹn</Button>
								</a>
							</div>
							<div className="w-20">
								<Button outline>Theo dõi</Button>
							</div>
						</div>
						{
							// Show more info
						}
						<div
							onClick={() => setShowMoreInfo(!showMoreInfo)}
							className="block lg:hidden text-center"
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
						<div className={`${showMoreInfo ? 'block' : 'hidden'} lg:block`}>
							<div className="pb-5 border-b border-gray-300">
								<h1 className="font-semibold text-base pb-2">Bio</h1>
								<div>Đây là bio</div>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
};

ArtistPage.propTypes = {
	artist: PropTypes.object.isRequired
};

export default ArtistPage;
