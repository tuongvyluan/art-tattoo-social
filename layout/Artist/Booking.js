import PropTypes from 'prop-types';
import { calculateTotal, fetcher, formatPrice, formatTime } from 'lib';
import { useEffect, useState } from 'react';
import {
	Avatar,
	Card,
	CardBody,
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Loading,
	Ripple
} from 'ui';
import { Search } from 'icons/outline';
import debounce from 'lodash.debounce';
import { BOOKING_STATUS, stringBookingStatuses } from 'lib/status';
import MyPagination from 'ui/MyPagination';
import { BASE_URL } from 'lib/env';
import ArtistCustomerServices from './ArtistCustomerServices';
import { ChevronDown } from 'icons/solid';

const ALL_TAB = '1';
const PENDING_TAB = '2';
const IN_PROGRESS_TAB = '3';
const COMPLETE_TAB = '4';
const CANCELLED_TAB = '5';

function ArtistBookingPage({ artistId }) {
	const [data, setData] = useState([]);
	const [studioList, setStudioList] = useState([]);
	const [currentStudio, setCurrentStudio] = useState(null);
	const [activeTab, setActiveTab] = useState('1');
	const [searchKey, setSearchKey] = useState('');
	const [page, setPage] = useState(1);
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

		fetcher(`${BASE_URL}/bookings/bookings-filter-artist?${getQueryParam()}`)
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
			});
	}, [filter, page, currentStudio]);

	const getQueryParam = () => {
		return `artistId=${artistId}&page=${page}&pageSize=${pageSize}${
			filter >= 0 ? `&status=${filter}` : ''
		}${currentStudio !== null ? '&studioId=' + currentStudio : ''}`;
	};

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
			case CANCELLED_TAB:
				setPage(1);
				setFilter(BOOKING_STATUS.CUSTOMER_CANCEL);
				break;
			default:
				setPage(1);
				setFilter(-1);
				break;
		}
	}, [activeTab]);

	useEffect(() => {
		fetcher(`${BASE_URL}/artists/${artistId}/artist-details`).then((response) => {
			const list = [{ id: null, studioName: 'Tất cả tiệm xăm' }];
			const map = new Map();
			map.set(null, 'Tất cả tiệm xăm');
			response?.studioArtists?.forEach((a) => {
				if (!map.has(a.id)) {
					list.push({
						id: a.id,
						studioName: a.studioName
					});
					map.set(a.id, a.studioName);
				}
			});
			setStudioList(list);
		});
	}, []);

	return (
		<div className="sm:px-8 md:px-1 lg:px-6 xl:px-56">
			<div className="mx-auto ring-1 ring-black ring-opacity-5 bg-white">
				<div className="flex flex-row w-0 min-w-full">
					<ul className="list-none grid col-span-4 grid-flow-col place-items-center overflow-x-auto w-0 min-w-full -mb-10 pb-10">
						<li
							className={`text-center  cursor-pointer ${
								activeTab === ALL_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<a
								onClick={() => {
									toggle(ALL_TAB);
								}}
								href="#"
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Tất cả
								<Ripple color="black" />
							</a>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === PENDING_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<a
								onClick={() => {
									toggle(PENDING_TAB);
								}}
								href="#"
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Chờ xác nhận
								<Ripple color="black" />
							</a>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === IN_PROGRESS_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<a
								onClick={() => {
									toggle(IN_PROGRESS_TAB);
								}}
								href="#"
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Đang thực hiện
								<Ripple color="black" />
							</a>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === COMPLETE_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<a
								href="#"
								onClick={() => {
									toggle(COMPLETE_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Hoàn thành
								<Ripple color="black" />
							</a>
						</li>
						<li
							className={`text-center cursor-pointer ${
								activeTab === CANCELLED_TAB
									? 'border-b-2 border-solid border-gray-700'
									: ''
							}`}
						>
							<a
								href="#"
								onClick={() => {
									toggle(CANCELLED_TAB);
								}}
								className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-3 md:px-2 lg:px-4 block"
							>
								Đã huỷ
								<Ripple color="black" />
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="my-3 flex flex-wrap gap-2 items-center">
				<div className="min-w-max">
					<label className="block font-semibold text-sm">Chọn tiệm xăm</label>
					<Dropdown className={'relative'}>
						<DropdownToggle>
							<div className="w-44 rounded-lg px-3 py-3 border border-gray-600 bg-white">
								{
									studioList?.filter((a) => a.id === currentStudio)?.at(0)
										?.studioName
								}
							</div>
							<div className="absolute top-4 right-2">
								<ChevronDown width={16} height={16} />
							</div>
						</DropdownToggle>
						<DropdownMenu className={'max-h-24 overflow-auto w-40 bg-white'}>
							<div className="w-44">
								{studioList.map((studio, index) => (
									<div
										key={studio.id}
										onClick={() => setCurrentStudio(studio.id)}
										className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
											studio.id === currentStudio ? 'bg-indigo-100' : ''
										}`}
									>
										{studio.studioName}
									</div>
								))}
							</div>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div className="flex-grow">
					<label className="block font-semibold text-sm">Tìm kiếm</label>
					<div className="relative bg-gray-200 rounded-lg p-1.5 flex items-center px-3">
						<span className="block">
							<Search width={18} height={18} />
						</span>
						<input
							value={searchKey}
							onChange={onSearch}
							onKeyDown={onKeyDown}
							className="my-2 appearance-none relative block w-full pl-3 pr-3 border-0 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 leading-none h-5 bg-transparent"
							placeholder="Bạn có thể tìm theo tên hình xăm, tên khách hàng, hoặc ID lịch hẹn"
						/>
					</div>
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
									<a className="text-black" href={`/booking/${booking.id}`}>
										<div className="cursor-pointer ">
											<div className="flex justify-between mx-auto border-b border-gray-300 pb-3">
												<div className="flex gap-2 items-center">
													<Avatar
														size={39}
														src={
															booking.studio.owner.avatar
																? booking.studio.owner.avatar
																: '/images/ATL.png'
														}
													/>
													<div>
														<div className="font-semibold text-base">
															{booking.studio.studioName}
														</div>
														<div className="text-base">
															Khách hàng: {booking?.customer?.fullName}
														</div>
													</div>
												</div>
												<div>
													<div className="text-red-500 font-semibold text-base">
														{stringBookingStatuses.at(booking.status)}
													</div>
												</div>
											</div>
											<div className="flex justify-between w-full pb-1">
												<div className="text-base font-semibold py-2">
													Các dịch vụ được đặt (
													{booking.bookingDetails.filter(
														(d) => d.artistId === artistId
													)?.length
														? booking.bookingDetails.filter(
																(d) => d.artistId === artistId
														  )?.length
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
											<ArtistCustomerServices
												canEdit={false}
												bookingId={booking.id}
												bookingDetails={booking.bookingDetails.filter(
													(d) => d.artistId === artistId
												)}
											/>

											<div className="flex justify-end pt-3 items-start">
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
																{formatPrice(
																	calculateTotal(
																		booking.bookingDetails.filter(
																			(d) => d.artistId === artistId
																		)
																	)
																)}
															</span>
														</div>
													}
												</div>
											</div>
										</div>
									</a>
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

ArtistBookingPage.propTypes = {
	artistId: PropTypes.string
};

export default ArtistBookingPage;
