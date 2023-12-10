import { ChevronLeft } from 'icons/solid';
import {
	extractBookingStatusTimeline,
	fetcherPut,
	formatDate,
	formatPrice,
	hasBookingMeeting,
	isFuture
} from 'lib';
import { BOOKING_STATUS, operationNames, stringBookingStatuses } from 'lib/status';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Alert, Card, CardBody, Link } from 'ui';
import { WidgetOrderStatus } from 'ui/WidgetOrderStatus';
import { useState } from 'react';
import CustomerServices from 'layout/CustomerServices';

const calculateTotal = (tattooArts) => {
	if (!tattooArts) {
		return 0;
	}
	let total = 0;
	tattooArts.forEach((a) => {
		a.bookingDetails.forEach((b) => {
			total += b.price;
		});
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
		isWarn: false
	});

	return (
		<div className="relative">
			<Alert
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				color={alertContent.isWarn ? 'red' : 'blue'}
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
									<div className="w-full md:pr-1 md:w-1/3 md:border-r mb-5 md:mb-0 md:border-b-0 border-b border-gray-300">
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
										<div>
											<div className="font-semibold text-xl py-2">
												Thông tin khách hàng
											</div>
											<div className="text-base">
												{renderData.customer.fullName}
											</div>
											<div>{renderData.customer.phoneNumber}</div>
											<div>{renderData.customer.email}</div>
										</div>
										{
											// Confirm ngày hẹn
										}
										{(bookingStatus === BOOKING_STATUS.CONFIRMED ||
											bookingStatus === BOOKING_STATUS.IN_PROGRESS) && (
											<div className="pt-3 mt-3 border-t border-gray-300">
												<div className="font-semibold text-xl pb-2">
													Thông tin buổi hẹn
												</div>
												<div className="">
													<div>
														{hasBookingMeeting(renderData.bookingMeetings) ? (
															<div>
																<div className="text-base">
																	<div className="pb-2">
																		Buổi hẹn kế tiếp vào ngày:
																	</div>
																	<div className="font-bold text-lg text-green-500">
																		{formatDate(
																			hasBookingMeeting(renderData.bookingMeetings)
																		)}
																	</div>
																</div>
															</div>
														) : (
															<div>
																{(renderData.status === BOOKING_STATUS.CONFIRMED ||
																	renderData.status === BOOKING_STATUS.PENDING ||
																	renderData.status ===
																		BOOKING_STATUS.IN_PROGRESS) && (
																	<div className="text-base">
																		<div className="pb-2">
																			Chưa có buổi hẹn kế tiếp
																		</div>
																	</div>
																)}
															</div>
														)}
													</div>
												</div>
											</div>
										)}
									</div>
									<div className="flex flex-col justify-start flex-grow pt-3 md:pt-0">
										{timeline.length > 0 ? (
											<WidgetOrderStatus timeline={timeline} />
										) : (
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
								<div className="pt-3 pb-3 border-b border-gray-300 pb-3">
									<div className="font-semibold text-xl pb-2">
										Mô tả của khách hàng
									</div>
									<div className="block">{renderData.description}</div>
								</div>
							)}

							{
								// Customer services
							}
							<div className="pt-3">
								<CustomerServices showMore={true} bookingDetails={renderData.bookingDetails} />
							</div>

							{
								// Booking detail list
							}
							{
								// Đơn hàng đã huỷ nhưng đã có tattoo art
								(((data.status === BOOKING_STATUS.CUSTOMER_CANCEL ||
									data.status === BOOKING_STATUS.STUDIO_CANCEL) &&
									data.tattooArts.length > 0) ||
									// Đơn hàng còn chưa bắt đầu
									data.status === BOOKING_STATUS.IN_PROGRESS ||
									data.status === BOOKING_STATUS.COMPLETED) && (
									<div className="mt-6 pt-3 border-t border-gray-300 pb-3">
										<div className="flex justify-between items-center font-semibold text-xl pb-2">
											<div>Chi tiết đơn hàng</div>
										</div>

										{
											// List hình xăm
										}
										{data.tattooArts?.map((tattoo, tattooIndex) => (
											<div key={tattoo.id}>
												<Link
													href={`/tattoo/update/${tattoo.id}?booking=${renderData.id}`}
												>
													<div className="cursor-pointer py-2 flex justify-start gap-3 flex-wrap">
														<div className="relative w-24 h-24">
															<Image
																layout="fill"
																src={
																	tattoo.thumbnail
																		? tattoo.thumbnail
																		: '/images/ATL.png'
																}
																alt={'a'}
																className="object-contain rounded-2xl"
															/>
														</div>
														<div className="flex-grow text-base">
															<div>
																<span>Nghệ sĩ xăm: </span>
																<span className="font-semibold">
																	{tattoo.artist.fullName}
																</span>
															</div>
															{tattoo.bookingDetails.map(
																(bookingDetail, bookingDetailIndex) => (
																	<div
																		key={bookingDetail.id}
																		className="flex justify-between items-center"
																	>
																		<div className="text-base">
																			{operationNames.at(bookingDetail.operationId)}
																		</div>
																		<div className="text-lg">
																			{formatPrice(bookingDetail.price)}
																		</div>
																	</div>
																)
															)}
														</div>
													</div>
												</Link>
											</div>
										))}
									</div>
								)
							}
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
													{formatPrice(calculateTotal(renderData.tattooArts))}
												</td>
											</tr>
											{/* <tr className="border-t border-gray-300">
												<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
													Thanh toán
												</th>
												<td className="py-3 text-right text-sm">
													<div>
														<span className="text-gray-600">
															{formatTime(new Date())} - Tiền mặt -{' '}
														</span>
														<span className="text-base">{formatPrice(1000000)}</span>
													</div>
													<div>
														<span className="text-gray-600">
															{formatTime(new Date())} - Ví điện tử -{' '}
														</span>
														<span className="text-base">{formatPrice(500000)}</span>
													</div>
												</td>
											</tr>
											<tr className="border-t border-gray-300">
												<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
													Còn lại
												</th>
												<td className="py-3 text-right text-xl text-red-500">
													<div>{formatPrice(500000)}</div>
												</td>
											</tr> */}
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
