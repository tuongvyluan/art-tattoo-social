import { ChevronLeft } from 'icons/solid';
import { calculateBookingTransactions, calculateTotal, formatPrice } from 'lib';
import { BOOKING_STATUS, stringBookingStatuses } from 'lib/status';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody, Link } from 'ui';
import { useState } from 'react';
import Heading from 'components/Heading';
import ArtistCustomerServices from './ArtistCustomerServices';

function BookingDetailsPage({ data, studioId, setLoading, artistId }) {
	const [renderData, setRenderData] = useState(data);
	const [total, setTotal] = useState(calculateTotal(renderData.bookingDetails));
	const [paidTotal, setPaidTotal] = useState(
		calculateBookingTransactions(renderData.transactions)
	);

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
									<div className="w-full md:pr-1 md:w-1/2 md:border-r pb-5 md:pb-0 md:border-b-0 border-b border-gray-300">
										<div>
											<Heading>Thông tin khách hàng</Heading>
											<div className="text-lg font-semibold">
												{renderData.customer.fullName}
											</div>
											<div>
												Số điện thoại:{' '}
												<span className="font-semibold text-base">
													{renderData.customer.phoneNumber}
												</span>
											</div>
											<div>
												Email:{' '}
												<span className="font-semibold text-base">
													{renderData.customer.email}
												</span>
											</div>
										</div>
									</div>
									<div className="pt-3 md:pt-0 md:pl-3 pl-0 w-full md:w-1/2">
										{renderData.status === BOOKING_STATUS.CUSTOMER_CANCEL ||
										renderData.status === BOOKING_STATUS.STUDIO_CANCEL ? (
											<div className="text-center my-auto text-base text-red-500">
												<div>ĐƠN HÀNG ĐÃ BỊ HUỶ</div>
											</div>
										) : (
											<div>
												<Heading>Thông tin tiệm xăm</Heading>
												<div className="text-lg font-semibold">
													{renderData.studio.studioName}
												</div>
												<div className="flex gap-1 flex-wrap w-full">
													<div>Địa chỉ: </div>
													<div className="font-semibold flex-grow w-min">
														{renderData.studio.address}
													</div>
												</div>
												<div>
													Giờ mở cửa:{' '}
													<span className="font-semibold text-base">
														{renderData.studio.openTime.split(':')[0]}:
														{renderData.studio.openTime.split(':')[1]} -{' '}
														{renderData.studio.closeTime.split(':')[0]}:
														{renderData.studio.closeTime.split(':')[1]}
													</span>
												</div>
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
								<ArtistCustomerServices
									showDetails={true}
									setLoading={setLoading}
									canEdit={renderData.status === BOOKING_STATUS.IN_PROGRESS}
									showMore={true}
									bookingDetails={renderData.bookingDetails}
									bookingId={renderData.id}
								/>
							</div>

							{
								// Final sum
							}
							{(renderData.status === BOOKING_STATUS.IN_PROGRESS ||
								renderData.status === BOOKING_STATUS.COMPLETED) &&
								renderData.bookingDetails?.length > 0 && (
									<div>
										<table className="w-full mb-3">
											<tbody>
												<tr className="border-t border-gray-300">
													<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
														Tổng tiền
													</th>
													<td className="py-3 text-right text-xl text-red-500">
														{/* {formatPrice(renderData.total)} */}
														{formatPrice(total)}
													</td>
												</tr>
												<tr className="border-t border-gray-300">
													<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
														Đã thanh toán
													</th>
													<td className="py-3 text-right text-xl text-green-500">
														{formatPrice(paidTotal)}
													</td>
												</tr>
												{total !== paidTotal && (
													<tr className="border-t border-gray-300">
														<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
															Còn {total > paidTotal ? 'lại' : 'thừa'}
														</th>
														<td className="py-3 text-right text-xl text-red-500">
															<div>
																{total > paidTotal
																	? formatPrice(total - paidTotal)
																	: formatPrice(paidTotal - total)}
															</div>
														</td>
													</tr>
												)}
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
