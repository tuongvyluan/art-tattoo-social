import PropTypes from 'prop-types';
import {
	stringBookingDetailStatus,
	stringBookingDetailStatusColor,
	stringPlacements,
	stringSize
} from 'lib/status';
import { formatPrice, formatTime, hasBookingMeeting, showTextMaxLength } from 'lib';
import { Avatar, Card } from 'ui';
import { MdCalendarMonth, MdOutlineCalendarMonth } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ScheduleBookingMeetingModal from './ScheduleBookingMeetingModal';

const CustomerServices = ({
	bookingDetails,
	canEdit = false,
	showMore = false,
	setLoading,
	showDetails = false
}) => {
	const [scheduleModal, setScheduleModal] = useState(false);
	const [scheduledBookingDetail, setScheduledBookingDetail] = useState(undefined);

	const onSelectScheduledBookingDetail = (detailIndex) => {
		setScheduledBookingDetail(bookingDetails.at(detailIndex));
	};

	// Oprn schedule modal when scheduledBookingDetail is not null
	useEffect(() => {
		if (scheduledBookingDetail) {
			setScheduleModal(true);
		}
	}, [scheduledBookingDetail]);

	// Reset scheduledBookingDetail when scheduleModal is closed
	useEffect(() => {
		if (scheduleModal === false) {
			setScheduledBookingDetail(undefined);
		}
	}, [scheduleModal]);

	return (
		<div className="relative">
			{showDetails && (
				<ScheduleBookingMeetingModal
					setLoading={setLoading}
					bookingDetail={scheduledBookingDetail}
					openModal={scheduleModal}
					setOpenModal={setScheduleModal}
				/>
			)}
			<div className="block">
				{bookingDetails.map((bookingDetail, bookingServiceIndex) => (
					<Card
						className={`shadow-lg ${
							!showMore && bookingServiceIndex > 2 ? 'hidden' : ''
						}`}
						key={bookingDetail.id}
					>
						<div className="w-full flex justify-start gap-2 items-start bg-gray-50 py-5 relative">
							{showDetails && (
								<div className="absolute top-4 right-4 cursor-pointer flex flex-wrap gap-2">
									<div
										onClick={() =>
											onSelectScheduledBookingDetail(bookingServiceIndex)
										}
										className="relative"
									>
										<MdCalendarMonth size={20} />
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
											href={`/tattoo/update/${bookingDetail.tattooArt.id}?booking=${bookingDetail.tattooArt.bookingId}`}
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
										<div className="border border-gray-300 rounded-xl w-24 h-24 cursor-default">
											<div className="px-2 py-7 text-center text-gray-600">
												Không có hình xăm
											</div>
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
										{bookingDetail.serviceMaxPrice === 0 ? (
											<div>Miễn phí</div>
										) : (
											<div>
												{formatPrice(bookingDetail.serviceMinPrice)} -{' '}
												{formatPrice(bookingDetail.serviceMaxPrice)}
											</div>
										)}
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
									{hasBookingMeeting(bookingDetail.bookingMeetings) && (
										<div className="flex flex-wrap gap-1 items-center text-base font-semibold bg-indigo-100 px-2 rounded-full">
											<MdOutlineCalendarMonth size={20} />
											<div>
												{formatTime(
													hasBookingMeeting(bookingDetail.bookingMeetings)
												)}
											</div>
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
											size={25}
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
	showMore: PropTypes.bool,
	setLoading: PropTypes.func,
	showDetails: PropTypes.bool
};

export default CustomerServices;
