import Heading from 'components/Heading';
import MyModal from 'components/MyModal';
import { Badge, Tooltip } from 'flowbite-react';
import {
	fetcherPut,
	formatDateTimeForInput,
	formatPrice,
	formatTime
} from 'lib';
import { BASE_URL } from 'lib/env';
import {
	BOOKING_MEETING_STATUS,
	stringBookingMeetingColors,
	stringBookingMeetingStatus,
	stringPlacements,
	stringSize
} from 'lib/status';
import moment from 'moment';
import PropTypes from 'propTypes';
import { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { Alert } from 'ui';

const ScheduleBookingMeetingModal = ({
	bookingDetail,
	openModal,
	setOpenModal,
	setLoading,
	canEdit
}) => {
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

	const handleCloseModal = () => {
		setOpenModal(false)
	};

	const updateBookingMeeting = (id, status) => {
		handleAlert(true, '', 'Đang cập nhật lịch hẹn', 0);
		const payload = {
			id: id,
			status: status
		};
		if (status === BOOKING_MEETING_STATUS.CANCELLED) {
			payload.cancelAt = formatDateTimeForInput(moment().add(12, 'hours'));
		}
		fetcherPut(`${BASE_URL}/booking-meetings`, payload)
			.then(() => {
				setLoading(true);
			})
			.catch((e) => {
				console.log(e)
				handleAlert(true, 'Cập nhật lịch hẹn thất bại', '', 2);
			});
	};

	return (
		<div className="relative">
			<MyModal
				size="xl"
				openModal={openModal}
				setOpenModal={setOpenModal}
				title={'Sắp xếp lịch hẹn'}
				confirmTitle="Đóng"
				onSubmit={handleCloseModal}
			>
				<Alert
					showAlert={showAlert}
					setShowAlert={setShowAlert}
					color={alertContent.isWarn}
					className="bottom-2 right-2 fixed max-w-md z-50"
				>
					<strong className="font-bold mr-1">{alertContent.title}</strong>
					<span className="block sm:inline">{alertContent.content}</span>
				</Alert>
				<div className="max-h-96 overflow-auto">
					<Heading>
						<div className="flex flex-wrap gap-1">
							<div className="flex gap-1 flex-wrap items-center">
								{stringSize.at(bookingDetail?.serviceSize)},
							</div>

							{bookingDetail?.servicePlacement ? (
								<div className="flex gap-1 flex-wrap items-center">
									Vị trí xăm: {stringPlacements.at(bookingDetail?.servicePlacement)},
								</div>
							) : (
								<></>
							)}

							{bookingDetail?.serviceCategory ? (
								<div className="flex gap-1 flex-wrap items-center">
									{bookingDetail?.serviceCategory.name},
								</div>
							) : (
								<></>
							)}

							<div className="flex gap-1 flex-wrap items-center">
								{bookingDetail?.serviceMaxPrice === 0 ? (
									<div>Miễn phí</div>
								) : (
									<div>
										{formatPrice(bookingDetail?.serviceMinPrice)} -{' '}
										{formatPrice(bookingDetail?.serviceMaxPrice)}
									</div>
								)}
							</div>
						</div>
					</Heading>
					{
						// Booking meeting list
					}
					{bookingDetail?.bookingMeetings?.length > 0 ? (
						<table className="w-full text-sm text-left text-gray-500 pb-20">
							<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
								<tr>
									<th scope="col" className="w-1/3 px-3 py-3 bg-gray-50 text-center">
										Ngày hẹn
									</th>
									<th scope="col" className="px-3 py-3 bg-gray-50 text-center">
										Trạng thái
									</th>
									<th scope="col" className="px-3 py-3 bg-gray-50 text-center"></th>
								</tr>
							</thead>
							<tbody>
								{bookingDetail?.bookingMeetings.map((time) => (
									<tr className="text-base" key={time.id}>
										<td scope="col" className="w-1/3 px-3 py-3 text-center">
											{formatTime(time.meetingTime)}
										</td>
										<td scope="col" className="px-3 py-3 text-center">
											<div className="flex justify-center w-full">
												<Badge color={stringBookingMeetingColors.at(time.status)}>
													{stringBookingMeetingStatus.at(time.status)}
												</Badge>
											</div>
										</td>
										<td scope="col" className="px-3 py-3 text-center">
											{time.status === BOOKING_MEETING_STATUS.PENDING && canEdit && (
												<div className="flex gap-3 flex-wrap">
													<Tooltip content="Huỷ hẹn">
														<div
															className="cursor-pointer"
															onClick={() =>
																updateBookingMeeting(
																	time.id,
																	BOOKING_MEETING_STATUS.CANCELLED
																)
															}
														>
															<BsTrash size={25} />
														</div>
													</Tooltip>
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div>Chưa có lịch hẹn nào cho dịch vụ này</div>
					)}
				</div>
			</MyModal>
		</div>
	);
};

ScheduleBookingMeetingModal.propTypes = {
	bookingDetail: PropTypes.object,
	openModal: PropTypes.bool.isRequired,
	setOpenModal: PropTypes.func.isRequired,
	setLoading: PropTypes.func,
	canEdit: PropTypes.bool
};

export default ScheduleBookingMeetingModal;
