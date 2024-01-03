import { ChevronLeft } from 'icons/solid';
import {
	calculateBookingTransactions,
	calculateTotal,
	extractServiceFromBookingDetail,
	formatPrice,
	formatTime
} from 'lib';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Alert, Card, CardBody } from 'ui';
import { useEffect, useState } from 'react';
import Heading from 'components/Heading';
import {
	BOOKING_DETAIL_STATUS,
	BOOKING_STATUS,
	stringBookingDetailStatus,
	stringBookingDetailStatusColor,
	stringTransactionMethod
} from 'lib/status';

const PaymentBooking = ({ booking }) => {
	const [bookingDetails, setBookingDetails] = useState(
		booking.bookingDetails.map((detail) => {
			return {
				...detail,
				selected: false
			};
		})
	);
	const [total, setTotal] = useState(calculateTotal(booking.bookingDetails));
	const [paidTotal, setPaidTotal] = useState(
		calculateBookingTransactions(booking.transactions)
	);

	return (
		<div className="relative sm:px-12 md:px-3 lg:px-10 xl:px-20">
			<Card>
				<CardBody>
					{
						// Booking ID & back icon
					}
					<div className="flex justify-between border-b border-gray-300 pb-3 mb-3">
						<Link prefetch={false} href={`/booking/${booking.id}`}>
							<div className="cursor-pointer flex gap-1 text-gray-500 hover:text-indigo-500">
								<ChevronLeft width={20} heigh={20} /> TRỞ LẠI
							</div>
						</Link>
						<div>
							<span>Mã đơn hàng: {booking?.id?.split('-').at(0)}</span>
						</div>
					</div>
					{
						// Customer info & booking status
					}
					<div className="border-b border-gray-300 pb-3 mb-3">
						<div className="flex justify-start flex-wrap">
							<div className="w-full">
								<div>
									<Heading>Thông tin khách hàng</Heading>
									<div className="text-lg font-semibold">
										{booking.customer.fullName}
									</div>
									<div>
										Số điện thoại:{' '}
										<span className="font-semibold">
											{booking.customer.phoneNumber}
										</span>
									</div>
									<div>
										Email:{' '}
										<span className="font-semibold">{booking.customer.email}</span>
									</div>
								</div>
							</div>
							<div className="flex flex-col justify-start flex-grow pt-3 md:pt-0">
								{(booking.status === BOOKING_STATUS.CUSTOMER_CANCEL ||
									booking.status === BOOKING_STATUS.STUDIO_CANCEL) && (
									<div className="text-center my-auto text-base text-red-500">
										<div>ĐƠN HÀNG ĐÃ BỊ HUỶ</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{
						// Booking details
					}
					<div className="mb-6">
						<Heading>Chi tiết đơn hàng</Heading>
						{
							// Tổng tiền
						}
						{bookingDetails?.length > 0 ? (
							<div className="relative shadow-md sm:rounded-lg min-w-max overflow-x-auto">
								<table className="w-full min-w-max text-sm text-left text-gray-500">
									<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
										<tr>
											<th
												scope="col"
												className="w-1/2 px-4 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Dịch vụ
											</th>
											<th
												scope="col"
												className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
											>
												Trạng thái
											</th>
											<th
												scope="col"
												className="px-4 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Giá
											</th>
										</tr>
									</thead>
									<tbody>
										{bookingDetails.map((detail, detailIndex) => (
											<tr key={detail.id} className="text-base">
												<td
													scope="col"
													className="text-left text-gray-900 w-16 lg:w-24 px-4 py-3 bg-white dark:bg-gray-800"
												>
													{extractServiceFromBookingDetail(detail)}
												</td>
												<td
													scope="col"
													className="text-left text-gray-900 w-40 px-4 py-3 bg-white dark:bg-gray-800"
												>
													<div className="flex w-full">
														<div
															className={`text-base text-black font-semibold bg-${stringBookingDetailStatusColor.at(
																detail.status
															)} px-2 rounded-full`}
														>
															<div>
																{stringBookingDetailStatus.at(detail.status)}
															</div>
														</div>
													</div>
												</td>
												<td className="text-left text-gray-900 w-24 lg:w-40 px-4 py-3 bg-white dark:bg-gray-800 text-base">
													<div
														className={`${
															detail.status === BOOKING_DETAIL_STATUS.CANCELLED &&
															'line-through'
														}`}
													>
														{formatPrice(detail.price)}
													</div>
												</td>
											</tr>
										))}

										<tr>
											<td
												colSpan={2}
												className="text-right bg-blue-50 text-gray-900 w-24 lg:w-40 px-4 py-3 dark:bg-gray-800 text-base"
											>
												Thành tiền
											</td>
											<td className="font-semibold text-left text-gray-900 w-24 lg:w-40 px-4 py-3 bg-yellow-50 dark:bg-gray-800 text-base">
												{formatPrice(total)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						) : (
							<div>Đơn hàng còn trống</div>
						)}
					</div>
					{
						// Transaction list
					}
					{booking.transactions?.length > 0 && (
						<div className="border-t border-gray-300 pt-3">
							<Heading>Lịch sử thanh toán</Heading>
							<div className="min-w-min overflow-auto">
								<table className="w-full min-w-min text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
									<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
										<tr>
											<th
												scope="col"
												className="w-28 px-4 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Thời gian
											</th>
											<th
												scope="col"
												className="w-36 px-2 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Phương thức thanh toán
											</th>
											<th
												scope="col"
												className="w-1/3 px-4 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Ghi chú
											</th>
											<th
												scope="col"
												className="w-28 px-4 py-3 bg-gray-50 dark:bg-gray-800"
											>
												Số tiền
											</th>
										</tr>
									</thead>
									<tbody>
										{booking.transactions.map((transaction, transactionIndex) => (
											<tr key={transaction.id} className="text-base">
												<td
													scope="col"
													className="text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
												>
													{formatTime(transaction.createdAt)}
												</td>
												<td className="text-left text-gray-900 sm:w-28 px-4 py-3 bg-white dark:bg-gray-800 text-base">
													{stringTransactionMethod.at(transaction.method)}
												</td>
												<td className="text-left text-gray-900 w-1/3 px-4 py-3 bg-white dark:bg-gray-800 text-base">
													{transaction.description}
												</td>
												<td
													scope="col"
													className={`text-left ${
														transaction.isRefund ? 'text-red-500' : 'text-gray-900'
													} w-16 lg:w-24 px-4 py-3 bg-white dark:bg-gray-800`}
												>
													{transaction.isRefund && '-'}
													{formatPrice(transaction.price)}
												</td>
											</tr>
										))}
										<tr>
											<td
												colSpan={3}
												className="text-right bg-blue-50 text-gray-900 w-24 lg:w-40 px-4 py-3 dark:bg-gray-800 text-base"
											>
												Tổng cộng
											</td>
											<td className="font-semibold text-left text-gray-900 w-24 lg:w-40 px-4 py-3 bg-yellow-50 dark:bg-gray-800 text-base">
												{formatPrice(paidTotal)}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					)}
					{total > paidTotal && (
						<div className="pt-5">
							<Heading>
								Còn lại:{' '}
								<span className="text-red-500">
									{formatPrice(total - paidTotal)}
								</span>
							</Heading>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

PaymentBooking.propTypes = {
	booking: PropTypes.object.isRequired
};

export default PaymentBooking;
