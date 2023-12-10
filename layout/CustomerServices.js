import PropTypes from 'prop-types';
import {
	stringBookingDetailStatus,
	stringBookingDetailStatusColor,
	stringPlacements,
	stringSize
} from 'lib/status';
import {
	formatPrice,
	formatTime,
	showTextMaxLength
} from 'lib';
import { Avatar, Card } from 'ui';
import { MdEdit, MdOutlineCalendarMonth, MdOutlineClose } from 'react-icons/md';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CustomerServices = ({ bookingDetails, canEdit = false, showMore = false }) => {
	const [selectedBookingDetail, setSelectedBookingDetail] = useState(undefined);

	const onSelectUpdatedService = (detailIndex) => {
		setSelectedArtist(0);
		setSelectedBookingDetail(bookingDetails.at(detailIndex));
		setBookingServiceModal(true);
	};

	return (
		<div className="relative">
			<div className="block">
				{bookingDetails.map((bookingDetail, bookingServiceIndex) => (
					<Card
						className={`shadow-lg ${
							!showMore && bookingServiceIndex > 2 ? 'hidden' : ''
						}`}
						key={bookingDetail.id}
					>
						<div className="w-full flex justify-start gap-2 items-start bg-gray-50 py-5 relative">
							{canEdit && (
								<div className="absolute top-4 right-4 cursor-pointer flex flex-wrap gap-2">
									<div
										onClick={() => onSelectUpdatedService(bookingServiceIndex)}
										className="relative"
									>
										<MdEdit size={20} />
									</div>
									<div className="relative">
										<MdOutlineClose size={20} />
									</div>
								</div>
							)}
							{
								// Phần hình xăm của booking service
							}
							<div className="flex justify-start gap-2 items-center bg-gray-50 pl-5">
								<div>
									{bookingDetail.tattooArt ? (
										<Link
											href={`/tattoo/${bookingDetail.tattooArt.id}?booking=${bookingDetail.tattooArt.bookingId}`}
										>
											<div className="cursor-pointer flex justify-start gap-3 flex-wrap">
												<div className="relative w-24 h-24">
													<Image
														layout="fill"
														src={
															bookingDetail.tattooArt.thumbnail
																? bookingDetail.tattooArt.thumbnail
																: '/images/ATL.png'
														}
														alt={'a'}
														className="object-contain rounded-2xl"
													/>
												</div>
											</div>
										</Link>
									) : (
										<div className="border border-black rounded-xl w-24 h-24 cursor-default">
											<div className="px-2 py-7 text-center">Không có hình xăm</div>
										</div>
									)}
								</div>
							</div>
							{
								// Phần bên phải của khung booking service
							}
							<div className="pl-3 pr-16 w-full">
								<div
									key={bookingDetail.id}
									className="pb-1 flex flex-wrap text-base"
								>
									<div>{bookingServiceIndex + 1}</div>
									<div className="pr-1">
										. {stringSize.at(bookingDetail.serviceSize)},
									</div>

									{bookingDetail.servicePlacement ? (
										<div className="pr-1">
											Vị trí xăm:{' '}
											{stringPlacements.at(bookingDetail.servicePlacement)},
										</div>
									) : (
										<></>
									)}

									{bookingDetail.serviceCategory ? (
										<div className="pr-1">{bookingDetail.serviceCategory.name},</div>
									) : (
										<></>
									)}

									<div className="pr-1">
										{formatPrice(bookingDetail.serviceMinPrice)} -{' '}
										{formatPrice(bookingDetail.serviceMaxPrice)}
									</div>
								</div>
								{
									//Description
								}
								<div className="pb-1">
									{showTextMaxLength(bookingDetail.description, 50)}
								</div>
								<div className="flex flex-wrap gap-3 items-center ">
									{
										// Giá tiền
									}
									{bookingDetail.price > 0 && (
										<div className="flex flex-wrap items-center text-base font-semibold bg-teal-300 px-2 rounded-full">
											<div>{formatPrice(bookingDetail.price)}</div>
										</div>
									)}
									{
										// Ngày hẹn
									}
									{bookingDetail.bookingMeetings?.length > 0 && (
										<div className="flex flex-wrap gap-1 items-center text-base font-semibold bg-indigo-100 px-2 rounded-full">
											<MdOutlineCalendarMonth serviceSize={20} />
											<div>{formatTime(new Date())}</div>
										</div>
									)}
									{
										// Trạng thái
									}
									<div
										className={`flex flex-wrap gap-1 items-center text-base font-semibold bg-${stringBookingDetailStatusColor.at(
											bookingDetail.status
										)} px-2 rounded-full`}
									>
										<div>{stringBookingDetailStatus.at(bookingDetail.status)}</div>
									</div>
								</div>
								{
									// Assign artist
								}
								{bookingDetail.artist && (
									<div className="flex flex-wrap gap-1 items-center text-base font-semibold pt-3">
										<Avatar
											serviceSize={40}
											src={
												bookingDetail.artist?.account?.avatar
													? bookingDetail.artist.account.avatar
													: '/public/images/ATL.png'
											}
										/>
										<div>{bookingDetail.artist?.account?.fullName}</div>
									</div>
								)}
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
};

CustomerServices.propTypes = {
	bookingDetails: PropTypes.array,
	canEdit: PropTypes.bool,
	showMore: PropTypes.bool
};

export default CustomerServices;
