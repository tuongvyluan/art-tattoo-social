import { ChevronLeft } from 'icons/solid';
import { extractBookingStatusTimeline, formatPrice } from 'lib';
import { BOOKING_STATUS, stringBookingStatuses } from 'lib/status';
import PropTypes from 'prop-types';
import Image from 'next/image';
import { Card, CardBody, Link } from 'ui';
import { WidgetOrderStatus } from 'ui/WidgetOrderStatus';

function BookingDetailsPage({ booking }) {
	const timeline = extractBookingStatusTimeline(booking);
	return (
		<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56">
			<Card>
				<CardBody>
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
							<span>Mã đơn hàng: {booking.id.split('-').reverse().at(0)} | </span>
							<span className="text-red-500">
								{stringBookingStatuses[booking.status]}
							</span>
						</div>
					</div>
					{
						// Customer info & booking status
					}
					<div className="pt-3 border-b border-gray-300 pb-3">
						<div className="font-semibold text-lg pb-2">Thông tin đơn hàng</div>
						<div className="flex justify-start flex-wrap">
							<div className="w-full pr-1 md:w-1/4 lg:w-1/3 sm:border-r sm:border-gray-300">
								<div className="text-base">{booking.customer.firstName}</div>
								<div>{booking.customer.phoneNumber}</div>
								<div>{booking.customer.email}</div>
							</div>
							<div className="flex flex-col justify-center flex-grow pt-3 md:pt-0">
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
						// Booking detail list
					}
					<div className="pt-3">
						<div className="flex justify-between items-center font-semibold text-lg pb-2">
							<div>Chi tiết đơn hàng</div>
						</div>

						{
							// List hình xăm
						}
						{booking.artTattoos?.map((tattoo, tattooIndex) => (
							<div key={tattoo.id}>
								<Link href={`/tattoo/${tattoo.id}?booking=${booking.id}`}>
									<div className="cursor-pointer py-2 flex justify-start gap-3 flex-wrap">
										<div className="relative w-32 h-32">
											<Image
												layout="fill"
												src={tattoo.photo}
												alt={'a'}
												className="object-contain"
											/>
										</div>
										<div className="flex-grow">
											<div>
												<span>Nghệ sĩ xăm: </span>
												<span className="font-semibold">
													{tattoo.artist.firstName}
												</span>
											</div>
											{tattoo.bookingDetails.map(
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
						))}
					</div>
					{
						// Final sum
					}
					<div className="pt-3">
						<table className="w-full">
							<tbody>
								<tr className="border-t border-b border-gray-300">
									<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
										Tổng tiền
									</th>
									<td className="py-3 text-right text-xl text-red-500">
										{formatPrice(booking.total)}
									</td>
								</tr>
								{
									// Button thêm hình xăm cho đơn hàng
									booking.status === BOOKING_STATUS.COMPLETED ? (
										<tr className="border-t border-gray-300">
											<th className="py-3 text-gray-500 w-fit sm:w-1/2 md:w-2/3 border-r pr-3 border-gray-300 text-right text-sm font-normal">
												Phương thức thanh toán
											</th>
											<td className="py-3 text-right text-base">Tiền mặt</td>
										</tr>
									) : (
										<></>
									)
								}
							</tbody>
						</table>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
BookingDetailsPage.propTypes = {
	booking: PropTypes.object
};
export default BookingDetailsPage;
