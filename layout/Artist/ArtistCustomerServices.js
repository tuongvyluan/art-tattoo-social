import PropTypes from 'prop-types';
import {
	BOOKING_DETAIL_STATUS,
	SERVICE_CATEGORY,
	stringBookingDetailStatus,
	stringBookingDetailStatusColor,
	stringPlacements,
	stringSize
} from 'lib/status';
import { fetcherPost, formatPrice, formatTime, showTextMaxLength } from 'lib';
import { Alert, Avatar, Card } from 'ui';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from 'components/Button';
import { BASE_URL } from 'lib/env';
import Router from 'next/router';

const ArtistCustomerServices = ({ bookingDetails, showMore = false, bookingId }) => {
	// Alert related vars
	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: 'blue'
	});

	const handleAlert = (state, title, content, isWarn = 0) => {
		setShowAlert((prev) => state);
		let color;
		switch (isWarn) {
			case 1:
				color = 'green';
				break;
			case 2:
				color = 'red';
				break;
			default:
				color = 'blue';
				break;
		}
		setAlertContent({
			title: title,
			content: content,
			isWarn: color
		});
	};
	const handleCreateTattooArtFromBookingDetail = (detail) => {
		const payload = {
			artistId: detail.artistId,
			bookingId: bookingId,
			bookingDetailId: detail.id,
			styleId: 1,
			thumbnail: '',
			description: '',
			size: detail.serviceSize,
			placement: detail.servicePlacement,
			isPublicized: false
		};
		handleAlert(true, 'Đang tạo hình xăm', '', 0);
		fetcherPost(`${BASE_URL}/TattooArts/CreateTattoo`, payload)
			.then((data) => {
				handleAlert(true, 'Tạo hình xăm thành công.', '', 1);
				Router.replace(`/tattoo/update/${data.id}?booking=${bookingId}`);
			})
			.catch(() => {
				handleAlert(true, 'Tạo hình xăm thất bại.', '', 2);
			});
	};

	return (
		<div className="relative">
			<Alert
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				color={alertContent.isWarn}
				className="bottom-2 right-2 fixed max-w-md z-50"
			>
				<strong className="font-bold mr-1">{alertContent.title}</strong>
				<span className="block sm:inline">{alertContent.content}</span>
			</Alert>
			<div className="block">
				{bookingDetails.map((bookingDetail, bookingServiceIndex) => (
					<Card
						className={`shadow-lg ${
							!showMore && bookingServiceIndex > 2 ? 'hidden' : ''
						}`}
						key={bookingDetail.id}
					>
						<div className="w-full flex justify-start gap-2 items-start bg-gray-50 py-5 relative">
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
										<div>
											<div className="border border-gray-300 rounded-xl w-24 h-24 cursor-default">
												<div className="px-2 py-7 text-center text-gray-600">
													Không có hình xăm
												</div>
											</div>
											{(bookingDetail.serviceCategoryId ===
												SERVICE_CATEGORY.NEW_TATTOO ||
												bookingDetail.serviceCategoryId ===
													SERVICE_CATEGORY.COVER_UP) &&
												bookingDetail.status ===
													BOOKING_DETAIL_STATUS.IN_PROGRESS && (
													<div className="flex pt-1">
														<Button
															onClick={() =>
																handleCreateTattooArtFromBookingDetail(bookingDetail)
															}
														>
															Tạo hình xăm
														</Button>
													</div>
												)}
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

ArtistCustomerServices.propTypes = {
	bookingDetails: PropTypes.array,
	bookingId: PropTypes.string.isRequired,
	showMore: PropTypes.bool
};

export default ArtistCustomerServices;
