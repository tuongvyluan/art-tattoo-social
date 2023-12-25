import PropTypes from 'prop-types';
import { calculateTotal, fetcher, formatPrice, formatTime } from 'lib';
import { useEffect, useState } from 'react';
import { Avatar, Card, CardBody, Loading, Ripple } from 'ui';
import { Search } from 'icons/outline';
import debounce from 'lodash.debounce';
import { BOOKING_STATUS, stringBookingStatuses } from 'lib/status';
import MyPagination from 'ui/MyPagination';
import { BASE_URL } from 'lib/env';
import CustomerServices from 'layout/CustomerServices';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from 'components/Button';

const ALL_TAB = '-1';
const PENDING_TAB = '0';
const IN_PROGRESS_TAB = '1';
const CUSTOMER_CANCELLED_TAB = '2';
const STUDIO_CANCELLED_TAB = '3';
const COMPLETE_TAB = '4';
const NOT_COMPLETE_TAB = '5';

function CustomerBookingPage({ customerId }) {
	const [data, setData] = useState([]);
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(
		router.query.active ? router.query.active : ALL_TAB
	);
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(router.query.page ? router.query.page : 1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [filter, setFilter] = useState(undefined);
	const [total, setTotal] = useState(0);
	const pageSize = 10;

	const onSearch = (e) => {
		setSearchKey(e.target.value);
	};

	const onKeyDown = (e) => {
		handleKeyDown(e);
	};

	const handleKeyDown = debounce((e) => {
		if (e.keyCode === 13 || e.key === 'Enter') {
			console.log(searchKey);
		}
	}, 300);

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	useEffect(() => {
		setLoading(true);
		setError(false);

		fetcher(
			`${BASE_URL}/bookings/get-all-bookings?customerId=${customerId}&page=${page}&pageSize=${pageSize}${
				filter >= 0 ? `&status=${filter}` : ''
			}`
		)
			.then((data) => {
				setData(data.data);
				setTotal(Math.ceil(data.total / pageSize));
				setLoading(false);
			})
			.catch((e) => {
				setData([]);
				setTotal(0);
				setError(true);
				setLoading(false);
			})
			.finally(() => {
				router.push(`/booking?active=${filter}&page=${page}`);
			});
	}, [filter, page]);

	useEffect(() => {
		switch (activeTab) {
			case PENDING_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.PENDING);
				break;
			case IN_PROGRESS_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.IN_PROGRESS);
				break;
			case COMPLETE_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.COMPLETED);
				break;
			case STUDIO_CANCELLED_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.STUDIO_CANCEL);
				break;
			case CUSTOMER_CANCELLED_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.CUSTOMER_CANCEL);
				break;
			case NOT_COMPLETE_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.NOT_COMPLETED);
				break;
			default:
				setPage(1);
				setFilter(-1);
				break;
		}
	}, [activeTab]);

	return (
		<div className="sm:px-8 md:px-1 lg:px-6 xl:px-56">
			<div className="mx-auto ring-1 ring-black ring-opacity-5 bg-white">
				{
					// Filter by status
				}
				<div className="flex flex-row w-0 min-w-full">
					<ul className="list-none grid col-span-4 grid-flow-col place-items-center overflow-x-auto w-0 min-w-full -mb-10 pb-10">
						<li
							className={`text-center  cursor-pointer ${
								activeTab === ALL_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(ALL_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Tất cả
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === PENDING_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(PENDING_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Chờ xác nhận
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === IN_PROGRESS_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(IN_PROGRESS_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Đang thực hiện
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === COMPLETE_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(COMPLETE_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Hoàn thành
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === CUSTOMER_CANCELLED_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(CUSTOMER_CANCELLED_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Khách hàng huỷ
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === STUDIO_CANCELLED_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(STUDIO_CANCELLED_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Tiệm xăm huỷ
								<Ripple color="black" />
							</button>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === NOT_COMPLETE_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<button
								onClick={() => {
									toggle(NOT_COMPLETE_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Đã dừng
								<Ripple color="black" />
							</button>
						</li>
					</ul>
				</div>
			</div>
			<div className="my-3">
				<div className="relative bg-gray-200 p-2 flex items-center px-3">
					<span className="block">
						<Search width={18} height={18} />
					</span>
					<input
						value={searchKey}
						onChange={onSearch}
						onKeyDown={onKeyDown}
						className="my-2 appearance-none relative block w-full pl-3 pr-3 border-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 leading-none h-5 bg-transparent"
						placeholder="Bạn có thể tìm theo tên hình xăm, tên khách hàng, hoặc ID đơn hàng"
					/>
				</div>
			</div>
			{error && (
				<div className="flex items-center justify-center h-full">
					Không tồn tại đơn hẹn xăm
				</div>
			)}
			{loading && (
				<div className="flex items-center justify-center h-full">
					<Loading />
				</div>
			)}
			{!loading && (
				<div className="relative">
					<div className="relative">
						{data.map((booking, index) => (
							<Card key={booking.id}>
								<CardBody>
									<Link className="text-black" href={`/booking/${booking.id}`}>
										<div className="cursor-pointer ">
											{
												// Booking header
											}
											<div className="flex justify-between items-center mx-auto border-b border-gray-300 pb-3">
												<div className="flex gap-2 items-center">
													<Avatar
														size={39}
														src={
															booking.studio.owner.avatar
																? booking.studio.owner.avatar
																: '/images/ATL.png'
														}
													/>
													<div className="font-semibold text-base">
														{booking.studio.studioName}
													</div>
												</div>
												<div>
													<div className="text-red-500 font-semibold text-base">
														{stringBookingStatuses.at(booking.status)}
													</div>
												</div>
											</div>
											{
												//Booking detail list
											}
											<div className="flex justify-between w-full pb-1">
												<div className="text-base font-semibold py-2">
													Các dịch vụ đã đặt (
													{booking.bookingDetails?.length
														? booking.bookingDetails?.length
														: '0'}
													)
												</div>
												<div>
													Ngày tạo đơn:{' '}
													<span className="text-base">
														{formatTime(booking.createdAt)}
													</span>
												</div>
											</div>
											<CustomerServices
												canEdit={false}
												bookingDetails={booking.bookingDetails}
											/>

											<div className="flex justify-end pt-5 items-start">
												<div className="text-right">
													{booking.cancelledAt && (
														<div>
															<div>
																Ngày huỷ:{' '}
																<span className="text-base">
																	{formatTime(booking.cancelledAt)}
																</span>
															</div>
														</div>
													)}
													{booking.completedAt && (
														<div>
															Ngày hoàn thành:{' '}
															<span className="text-base">
																{formatTime(booking.completedAt)}
															</span>
														</div>
													)}
													{
														<div>
															Tổng tiền:{' '}
															<span className="text-xl text-red-500">
																{formatPrice(calculateTotal(booking.bookingDetails))}
															</span>
														</div>
													}
												</div>
											</div>
										</div>
									</Link>
									{booking.status === BOOKING_STATUS.COMPLETED && (
										<div className="flex justify-end pt-3">
											<div className='w-max'>
												<a
													target="_blank"
													href={`/feedback/${booking.id}`}
													className="block text-center text-white bg-gray-800 hover:bg-gray-700 font-medium rounded-lg text-sm py-2 px-5 w-full"
												>
													Đánh giá
												</a>
											</div>
										</div>
									)}
								</CardBody>
							</Card>
						))}
					</div>

					{total > 0 && (
						<MyPagination current={page} setCurrent={setPage} totalPage={total} />
					)}
				</div>
			)}
		</div>
	);
}

CustomerBookingPage.propTypes = {
	customerId: PropTypes.string
};

export default CustomerBookingPage;
