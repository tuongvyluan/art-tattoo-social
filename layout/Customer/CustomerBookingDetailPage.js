import { ChevronLeft } from 'icons/solid';
import {
	extractBookingStatusTimeline,
	fetcher,
	fetcherPut,
	formatDate,
	formatDateForInput,
	formatPrice,
	formatDateTime
} from 'lib';
import {
	BOOKING_STATUS,
	stringBookingStatuses,
	stringColor,
	stringDifficult,
	stringPlacements,
	stringSize
} from 'lib/status';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Alert, Card, CardBody, Link } from 'ui';
import { WidgetOrderStatus } from 'ui/WidgetOrderStatus';
import { useEffect, useState } from 'react';
import Button from 'components/Button';
import { BASE_URL } from 'lib/env';
import MyModal from 'components/MyModal';
import cancelReasons from 'lib/cancelReasons';
import SelectServicePage from './SelectService';
import { Modal } from 'flowbite-react';

function CustomerBookingDetailPage({ data, customerId, setLoading }) {
	const [services, setServices] = useState([]);
	const [renderData, setRenderData] = useState(data);

	const timeline = extractBookingStatusTimeline(renderData);
	const [bookingStatus, setBookingStatus] = useState(renderData.status);

	// Cancel related vars
	const [cancelStatus, setCancelStatus] = useState(BOOKING_STATUS.CUSTOMER_CANCEL);
	const [confirmCancelBookingModal, setConfirmCancelBookingModal] = useState(false);
	const [cancelReason, setCancelReason] = useState(cancelReasons.at(0).reason);
	const [cancelReasonMore, setCancelReasonMore] = useState('');

	const handleCancelReason = ({ status, reason }) => {
		setCancelReason(reason);
		setCancelStatus(status);
	};

	const handleAfterConfirmed = (status) => {
		handleAlert(true, 'Đang cập nhật trạng thái');
		const body = {
			status: status
		};
		if (status === BOOKING_STATUS.CUSTOMER_CANCEL) {
			body.customerCancelReason = cancelReason.concat(` ${cancelReasonMore}`);
		}
		if (status === BOOKING_STATUS.STUDIO_CANCEL) {
			body.studioCancelReason = cancelReason.concat(` ${cancelReasonMore}`);
		}
		fetcherPut(`${BASE_URL}/studios/${customerId}/bookings/${renderData.id}`, body)
			.then((data) => {
				setBookingStatus(status);
				handleAlert(true, 'Cập nhật trạng thái đơn hàng thành công');
				setLoading(true);
			})
			.catch((e) => {
				handleAlert(true, 'Cập nhật trạng thái đơn hàng thành công');
			});
		setConfirmCancelBookingModal(false);
	};

	useEffect(() => {
		if (renderData.status !== BOOKING_STATUS.PENDING) {
			renderData.bookingMeetings = [
				{
					date: new Date(new Date(data.createdAt).valueOf() + Math.random() * 1e10),
					status: 'Pending',
					createdAt: new Date(
						new Date(data.createdAt).valueOf() + Math.random() * 1e10
					)
				},
				{
					date: new Date(new Date(data.createdAt).valueOf() + Math.random() * 1e10),
					status: 'Completed',
					createdAt: new Date(
						new Date(data.createdAt).valueOf() + Math.random() * 1e10
					)
				},
				{
					date: new Date(new Date(data.createdAt).valueOf() + Math.random() * 1e10),
					status: 'Completed',
					createdAt: new Date(
						new Date(data.createdAt).valueOf() + Math.random() * 1e10
					)
				}
			];
		}
	}, []);

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

			<MyModal
				title="Xác nhận huỷ đơn"
				warn={true}
				openModal={confirmCancelBookingModal}
				setOpenModal={setConfirmCancelBookingModal}
				onSubmit={() => handleAfterConfirmed(cancelStatus)}
			>
				<div>
					<ul className="h-36 pb-6 overflow-y-auto">
						{cancelReasons.map((reason, index) => (
							<li
								className="my-1 full px-3 py-1 gap-2 flex items-center cursor-pointer"
								onClick={() => handleCancelReason(reason)}
								key={index}
							>
								<input
									type="radio"
									value={index}
									onChange={() => handleCancelReason(reason)}
									checked={cancelReason === reason.reason}
								/>
								<div>{reason.reason}</div>
							</li>
						))}
					</ul>
					<label className="text-sm font-semibold">Mô tả lý do</label>
					<textarea
						rows={4}
						type="text"
						value={cancelReasonMore}
						onChange={(e) => setCancelReasonMore(e.target.value)}
						className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
					/>
				</div>
			</MyModal>
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
									<span>
										Mã đơn hàng: {renderData.id.split('-').reverse().at(0)} |{' '}
									</span>
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
											<div>{renderData.studio.address}</div>
											<div>
												{formatDateTime(renderData.studio.openTime)} -{' '}
												{formatDateTime(renderData.studio.closeTime)}
											</div>
											<div>{renderData.studio.owner.phoneNumber}</div>
										</div>
										{
											// Confirm ngày hẹn
										}
										<div className="pt-3 mt-3 border-t border-gray-300">
											<div className="font-semibold text-xl pb-2">
												Thông tin ngày hẹn
											</div>
											<div className="">
												<div>
													{renderData.bookingMeetings &&
													renderData.bookingMeetings.at(0)?.status === 'Pending' ? (
														<div>
															<div className="text-base">
																<div className="pb-2">
																	Buổi hẹn kế tiếp vào ngày:
																</div>
																<div className="font-bold text-lg text-green-500">
																	{formatDate(bookingStatus.meetingDate)}
																</div>
															</div>
														</div>
													) : (
														<div className="text-base">
															<div className="pb-2">Chưa có buổi hẹn kế tiếp</div>
														</div>
													)}
												</div>
											</div>
										</div>
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
								<div className="flex justify-between w-full pb-1">
									<div className="font-semibold text-xl pb-2">Chi tiết đơn hàng</div>
								</div>
								<div className="block">
									{renderData.services.map((service, serviceIndex) => (
										<div key={service.id}>
											<div className="flex justify-between items-center w-full">
												<div
													key={service.id}
													className="pb-1 flex flex-wrap text-base"
												>
													<div>{serviceIndex + 1}</div>
													<div className="pr-1">
														. {stringSize.at(service.size)},
													</div>

													{service.placement ? (
														<div className="pr-1">
															Vị trí xăm: {stringPlacements.at(service.placement)},
														</div>
													) : (
														<></>
													)}

													<div className="pr-1">
														{stringColor(service.hasColor)},
													</div>

													<div className="pr-1">
														{stringDifficult(service.isDifficult)},
													</div>

													<div className="pr-1">
														{formatPrice(service.minPrice)} -{' '}
														{formatPrice(service.maxPrice)}
													</div>
												</div>
												<div className="pb-1 flex flex-wrap gap-2 items-center text-base">
													<div>Số lượng: 1</div>
												</div>
											</div>
											<div>
												{renderData.tattooArts?.at(serviceIndex) && (
													<div
														key={renderData.tattooArts?.at(serviceIndex).id}
														className="py-2 flex flex-row justify-start gap-3 flex-wrap"
													>
														<Link
															href={`/tattoo/${
																renderData.tattooArts?.at(serviceIndex).id
															}?booking=${data.id}`}
														>
															<div className="cursor-pointer py-2 flex justify-start gap-3 flex-wrap">
																<div className="relative w-24 h-24">
																	<Image
																		layout="fill"
																		src={
																			renderData.tattooArts?.at(serviceIndex)
																				.thumbnail
																				? renderData.tattooArts?.at(serviceIndex)
																						.thumbnail
																				: '/images/ATL.png'
																		}
																		alt={renderData.tattooArts?.at(serviceIndex).id}
																		className="object-contain"
																	/>
																</div>
																<div className="flex-grow">
																	<div>
																		<span>Nghệ sĩ xăm: </span>
																		<span className="font-semibold">
																			{
																				renderData.tattooArts?.at(serviceIndex)
																					.artist?.firstName
																			}{' '}
																			{
																				renderData.tattooArts?.at(serviceIndex)
																					.artist?.lastName
																			}
																		</span>
																	</div>
																	{renderData.tattooArts
																		?.at(serviceIndex)
																		.bookingDetails.map(
																			(bookingDetail, bookingDetailIndex) => (
																				<div
																					key={bookingDetail.id}
																					className="flex justify-between items-center"
																				>
																					<div className="text-base">
																						{bookingDetail.operationName}
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
												)}
											</div>
										</div>
									))}
								</div>
							</div>

							{
								// Booking detail list
							}

							<div
								className={`${
									renderData.status === BOOKING_STATUS.COMPLETED ||
									renderData.status === BOOKING_STATUS.CUSTOMER_CANCEL ||
									renderData.status === BOOKING_STATUS.STUDIO_CANCEL
										? 'hidden'
										: 'mx-auto pt-3 flex flex-wrap justify-center gap-3'
								}`}
							>
								{(renderData.status === BOOKING_STATUS.PENDING ||
									renderData.status === BOOKING_STATUS.CONFIRMED) && (
									<div className="w-20 ">
										<Button
											warn={true}
											outline
											onClick={() => {
												setCancelReasonMore('');
												setConfirmCancelBookingModal(true);
											}}
										>
											Huỷ
										</Button>
									</div>
								)}
							</div>
							{
								// Final sum
							}
							<div className="pt-3">
								<table className="w-full">
									<tbody>
										{(renderData.status === BOOKING_STATUS.IN_PROGRESS ||
											renderData.status === BOOKING_STATUS.COMPLETED) && (
											<tr className="border-t border-gray-300">
												<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
													Tổng tiền
												</th>
												<td className="py-3 text-right text-xl text-red-500">
													{/* {formatPrice(renderData.total)} */}
													{formatPrice(2000000)}
												</td>
											</tr>
										)}
										{
											// Button thêm hình xăm cho đơn hàng
											// renderData.status === BOOKING_STATUS.COMPLETED ? (
											// 	<tr className="border-t border-gray-300">
											// 		<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
											// 			Phương thức thanh toán
											// 		</th>
											// 		<td className="py-3 text-right text-base">Tiền mặt</td>
											// 	</tr>
											// ) : (
											// 	<></>
											// )
										}
										<tr className="border-t border-gray-300">
											<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
												Thanh toán
											</th>
											<td className="py-3 text-right text-sm">
												<div>
													<span className="text-gray-600">
														{formatDateTime(new Date())} - Tiền mặt -{' '}
													</span>
													<span className="text-base">{formatPrice(1000000)}</span>
												</div>
												<div>
													<span className="text-gray-600">
														{formatDateTime(new Date())} - Ví điện tử -{' '}
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
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
CustomerBookingDetailPage.propTypes = {
	data: PropTypes.object,
	customerId: PropTypes.string,
	setLoading: PropTypes.func
};
export default CustomerBookingDetailPage;
