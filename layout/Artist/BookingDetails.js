import { ChevronLeft } from 'icons/solid';
import {
	extractBookingStatusTimeline,
	formatDate,
	formatPrice,
	hasBookingMeeting
} from 'lib';
import { BOOKING_STATUS, stringBookingStatuses } from 'lib/status';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody, Link } from 'ui';
import { WidgetOrderStatus } from 'ui/WidgetOrderStatus';
import { useState } from 'react';
import CustomerServices from 'layout/CustomerServices';
import Heading from 'components/Heading';

const calculateTotal = (bookingDetails) => {
	if (!bookingDetails) {
		return 0;
	}
	let total = 0;
	bookingDetails.forEach((a) => {
		total += a.price;
	});
	return total;
};

function BookingDetailsPage({ data, studioId, setLoading, artistId }) {
	const [renderData, setRenderData] = useState(data);

	const timeline = extractBookingStatusTimeline(renderData);
	const [bookingStatus, setBookingStatus] = useState(renderData.status);

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

			<div key={bookingStatus} className="sm:px-12 md:px-3 lg:px-10 xl:px-28">
				<Card>
					<CardBody>
						<div>
							{
								// Booking ID & back icon
							}
							<div className="flex justify-between border-b border-gray-300 pb-3">
								<Link href="/booking">
									<div className="cursor-pointer flex gap-1 text-gray-500 hover:text-indigo-500">
										<ChevronLeft width={20} heigh={20} /> TRỞ LẠI
									</div>
								</Link>
								<div>
									<span>Mã đơn hàng: {renderData.id.split('-').at(0)} | </span>
									<span className="text-red-500">
										{stringBookingStatuses[bookingStatus]}
									</span>
								</div>
							</div>
							{
								// Customer info & booking status
							}
							<div className="pt-5 border-b border-gray-300 pb-3">
								<div className="flex justify-start flex-wrap">
									<div className="w-full md:pr-1 md:w-1/2 md:border-r mb-5 md:mb-0 md:border-b-0 border-b border-gray-300">
										<div>
											<div className="font-semibold text-xl pb-2">
												Thông tin tiệm xăm
											</div>
											<div className="text-base">{renderData.studio.studioName}</div>
											<div>Địa chỉ: {renderData.studio.address}</div>
											<div>
												Giờ mở cửa: {renderData.studio.openTime.split(':')[0]}:
												{renderData.studio.openTime.split(':')[1]} -{' '}
												{renderData.studio.closeTime.split(':')[0]}:
												{renderData.studio.closeTime.split(':')[1]}
											</div>
										</div>
									</div>
									<div className="flex flex-col justify-start flex-grow pt-3 md:pt-0">
										{(renderData.status === BOOKING_STATUS.CUSTOMER_CANCEL ||
											renderData.status === BOOKING_STATUS.STUDIO_CANCEL) && (
											<div className="text-center my-auto text-base text-red-500">
												<div>ĐƠN HÀNG ĐÃ BỊ HUỶ</div>
											</div>
										)}
									</div>
								</div>
							</div>
							{
								// Customer description
							}
							{renderData.description && (
								<div className="pt-3 pb-3 border-b border-gray-300">
									<div className="font-semibold text-xl pb-2">
										Mô tả của khách hàng
									</div>
									<div className="block">{renderData.description}</div>
								</div>
							)}

							{
								// Booking detail list
							}
							<div className="pt-3">
								<div className="flex justify-between w-full pb-1">
									<Heading>
										Các dịch vụ đã đặt ({renderData.bookingDetails?.length})
									</Heading>
								</div>
								<CustomerServices
									showMore={true}
									bookingDetails={renderData.bookingDetails}
								/>
							</div>

							{
								// Final sum
							}
							{(renderData.status === BOOKING_STATUS.IN_PROGRESS ||
								renderData.status === BOOKING_STATUS.COMPLETED) && (
								<div>
									<table className="w-full mb-3">
										<tbody>
											<tr className="border-t border-gray-300">
												<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
													Tổng tiền
												</th>
												<td className="py-3 text-right text-xl text-red-500">
													{/* {formatPrice(renderData.total)} */}
													{formatPrice(calculateTotal(renderData.bookingDetails))}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
BookingDetailsPage.propTypes = {
	data: PropTypes.object,
	studioId: PropTypes.string,
	setLoading: PropTypes.func,
	artistId: PropTypes.string
};
export default BookingDetailsPage;
