import {
	Alert,
	Avatar,
	BackgroundImg,
	Dropdown,
	DropdownMenu,
	DropdownToggle
} from 'ui';
import PropTypes from 'prop-types';
import BookingModal from 'components/BookingModal';
import Link from 'next/link';
import ServicePage from './Studio/Service';
import { useState } from 'react';
import {
	extractServiceName,
	fetcherPost,
	formatDate,
	formatPrice,
	formatTimeWithoutSecond
} from 'lib';
import { BASE_URL } from 'lib/env';
import Router from 'next/router';
import { v4 } from 'uuid';
import { stringServiceCategories } from 'lib/status';
import { BsTrash } from 'react-icons/bs';
import MyInput from 'components/MyInput';
import { ChevronDown } from 'icons/outline';
import moment from 'moment';

const estimeDate = [
	`Trong vòng 7 ngày tới (từ ${formatDate(moment())} tới ${formatDate(
		moment().add(7, 'days')
	)})`,
	`Trong 2 tuần kế tiếp (từ ${formatDate(moment())} tới ${formatDate(
		moment().add(14, 'days')
	)})`,
	`Trong tháng này (từ ${formatDate(moment())} tới ${formatDate(
		moment().add(1, 'months')
	)})`,
	`Trong tháng sau (từ ${formatDate(moment().add(1, 'months'))} tới ${formatDate(
		moment().add(2, 'months')
	)})`,
	'Lúc nào cũng được'
];

const BookingForm = ({
	studio,
	hasLogin = true,
	customerId
}) => {
	const [serviceList, setServiceList] = useState(studio.services);
	const [description, setDescription] = useState('');
	const [time, setTime] = useState(0);
	const [estimateTime, setEstimateTime] = useState(studio.openTime);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(0);
	const [selectedServices, setSelectedServices] = useState(new Map());
	const [bookingDetails, setBookingDetails] = useState([]);
	const [artists, setArtists] = useState(
		[
			{
				id: null,
				account: {
					fullName: 'Nghệ sĩ bất kỳ'
				}
			}
		].concat(studio.artists)
	);

	const handleSelectChange = (isIncrease, service) => {
		if (isIncrease) {
			setMinPrice((prev) => prev + service.minPrice);
			setMaxPrice((prev) => prev + service.maxPrice);
			handleAddBookingDetail(service);
		} else {
			setMinPrice((prev) => prev - service.minPrice);
			setMaxPrice((prev) => prev - service.maxPrice);
		}
		selectedServices.set(service.id, service.quantity);
	};

	const handleAddBookingDetail = (service) => {
		const id = v4();
		const detail = {
			id: id,
			service: service,
			serviceId: service.id,
			description: '',
			artistId: null
		};
		const details = [...bookingDetails];
		details.push(detail);
		setBookingDetails(details);
	};

	const handleRemoveBookingDetail = (index) => {
		const details = [...bookingDetails];
		const service = details.at(index).service;
		handleSelectChange(false, service);
		const services = [...serviceList];
		const serviceIndex = services.findIndex((s) => s.id === service.id);
		services[serviceIndex] = {
			...service,
			quantity: services[serviceIndex].quantity - 1
		};
		setServiceList(services);
		details.splice(index, 1);
		setBookingDetails(details);
	};

	const handleChangeBookingDetail = (index, name, value) => {
		console.log(value);
		const detail = {
			...bookingDetails[index],
			[name]: value
		};
		bookingDetails[index] = detail;
		setBookingDetails([...bookingDetails]);
	};

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
	const handleSubmit = () => {
		handleAlert(true, 'Đang đặt hẹn', '', 0);
		let newDescription = `Thời gian hẹn dự tính: ${estimeDate.at(
			time
		)}, lúc ${formatTimeWithoutSecond(estimateTime)}. ${description}`;
		fetcherPost(`${BASE_URL}/customers/CreateBookingWithServices`, {
			studioId: studio.id,
			customerId: customerId,
			description: newDescription,
			bookingDetails: bookingDetails
		})
			.then((data) => {
				handleAlert(true, 'Đặt hẹn thành công', '', 1);
				Router.replace('/booking');
			})
			.catch((e) => {
				handleAlert(true, 'Đặt hẹn thất bại', '', 2);
			});
	};

	const handleRefresh = () => {
		Router.replace(window.location.href);
	};
	return (
		<div className="relative">
			<div className="absolute -top-3 -left-5 -right-10 h-noFooter">
				<BackgroundImg
					image={'/images/booking-img.jpg'}
					className="relative w-full h-full bg-center bg-cover bg-fallback"
				/>
				<div className="relative h-noFooter">
					<BookingModal
						redirectUrl={customerId ? '/booking' : '/'}
						canConfirm={typeof customerId !== 'undefined'}
						onSubmit={customerId ? handleSubmit : handleRefresh}
						confirmTitle={customerId ? 'Xác nhận' : 'Tải lại trang'}
						size={customerId ? '5xl' : 'md'}
					>
						{hasLogin ? (
							<div>
								{customerId ? (
									<div className="h-96 w-full min-w-min overflow-auto relative">
										<Alert
											showAlert={showAlert}
											setShowAlert={setShowAlert}
											color={alertContent.isWarn}
											className="bottom-2 right-2 fixed max-w-md z-50"
										>
											<strong className="font-bold mr-1">
												{alertContent.title}
											</strong>
											<span className="block sm:inline">{alertContent.content}</span>
										</Alert>
										{/* <!-- Hiển thị tên studio --> */}
										<div className="flex bg-white flex-row w-0 min-w-full">
											<div className="flex justify-between items-center py-4 px-2">
												<div className="flex items-center">
													<div>
														<Avatar
															size={50}
															src={studio.avatar ? studio.avatar : '/images/ATL.png'}
															alt={`avatar`}
														/>
													</div>
													<div className="flex flex-row ltr:ml-6 rtl:mr-6 ">
														<div className="sm:inline-block text-base flex flex-row  font-medium ml-2">
															<p className="ltr:mr-2 rtl:ml-2 font-bold">
																{studio.name}
															</p>
														</div>
														<p className="mt-2 font-hairline text-sm">
															{/* 123,456 {t("followers")} */}
														</p>
													</div>
												</div>
											</div>
										</div>
										{/* <!-- Hiển thị form--> */}
										<div className=" overflow-y-auto min-w-full py-4 px-2">
											<h2 className="text-xl font-semibold mb-4">
												Chọn dịch vụ bạn mong muốn:
											</h2>
											<form>
												{serviceList && (
													<div>
														<ServicePage
															onChange={handleSelectChange}
															services={serviceList}
														/>
													</div>
												)}

												<h2 className="text-lg font-semibold mb-2">
													Chi tiết yêu cầu
												</h2>
												<div className="mb-4 mr-4">
													{bookingDetails.map((detail, detailIndex) => (
														<div key={detail.id} className="pt-3">
															<div className="text-lg">
																{detailIndex + 1}.{' '}
																{extractServiceName(detail.service)} -{' '}
																{stringServiceCategories.at(
																	detail.service.serviceCategoryId
																)}
															</div>
															<div className="flex flex-wrap gap-2 my-2 items-center">
																<div>Nghệ sĩ xăm mong muốn:</div>
																<Dropdown className={'relative w-44'}>
																	<DropdownToggle>
																		<div className="appearance-none relative block w-full px-3 py-2.5 border border-gray-600 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-base leading-none">
																			<div>
																				{
																					artists
																						.filter((a) => a.id === detail.artistId)
																						.at(0).account.fullName
																				}
																			</div>
																			<div className="absolute top-2 right-2">
																				<ChevronDown width={16} height={16} />
																			</div>
																		</div>
																	</DropdownToggle>
																	<DropdownMenu>
																		{artists.map((a, aIndex) => (
																			<div
																				key={a.id}
																				onClick={() =>
																					handleChangeBookingDetail(
																						detailIndex,
																						'artistId',
																						a.id
																					)
																				}
																				className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
																					a.id === detail.artistId
																						? 'bg-indigo-100'
																						: ''
																				}`}
																			>
																				{a.account.fullName}
																			</div>
																		))}
																	</DropdownMenu>
																</Dropdown>
															</div>
															<div className="flex justify-between items-center gap-2">
																<MyInput
																	name="description"
																	value={detail.description}
																	onChange={(e) =>
																		handleChangeBookingDetail(
																			detailIndex,
																			'description',
																			e.target.value
																		)
																	}
																/>
																<div
																	className="cursor-pointer"
																	onClick={() =>
																		handleRemoveBookingDetail(detailIndex)
																	}
																>
																	<BsTrash size={25} />
																</div>
															</div>
														</div>
													))}
												</div>

												<h2 className="text-lg font-semibold mb-4">
													Bạn có thể đến xăm vào lúc?
												</h2>
												<div className="flex flex-wrap items-center gap-2 mb-4">
													<div>
														<Dropdown className={'relative'}>
															<DropdownToggle className={'relative'}>
																<div
																	className={
																		'appearance-none relative block w-full pl-1 pr-7 py-2.5 border border-gray-600 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-base leading-none'
																	}
																>
																	{estimeDate.at(time)}
																</div>
																<div className="absolute top-2.5 right-2">
																	<ChevronDown width={16} height={16} />
																</div>
															</DropdownToggle>
															<DropdownMenu className={'max-h-24 overflow-auto'}>
																<div>
																	{estimeDate.map((date, index) => (
																		<div
																			className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
																				index === time && 'bg-blue-50'
																			}`}
																			onClick={() => setTime(index)}
																			key={date}
																			value={index}
																		>
																			{date}
																		</div>
																	))}
																</div>
															</DropdownMenu>
														</Dropdown>
													</div>
													<div className="flex items-center gap-2">
														<div>Vào lúc</div>
														<div>
															<input
																type="time"
																className="bg-gray-50 border border-gray-600 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
																min={studio.openTime}
																max={studio.closeTime}
																step={1}
																value={estimateTime}
																onChange={(e) => setEstimateTime(e.target.value)}
															/>
														</div>
													</div>
												</div>
												<div className="mt-3 mb-10">
													Giá dịch vụ ước tính:{' '}
													{maxPrice > 0 && (
														<span className="text-lg">
															{formatPrice(minPrice)} - {formatPrice(maxPrice)}
														</span>
													)}
												</div>
											</form>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-center h-full">
										<div>
											<div className="text-center">
												Bạn hãy kiểm tra hộp thư và xác thực email để thực hiện đặt
												hẹn nhé!
											</div>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="flex items-center justify-center h-full">
								<div>
									<div className="text-center">
										Bạn phải đăng nhập để được đặt lịch
									</div>
									<div className="flex justify-center gap-1">
										<span>Đi tới trang</span>
										<Link href="/auth/signin" target="_blank">
											<span className="underline cursor-pointer text-blue-700">
												đăng nhập
											</span>
										</Link>
										<span>hoặc</span>
										<Link href="/auth/register" target="_blank">
											<span>
												<span className="underline cursor-pointer text-blue-700">
													đăng ký
												</span>
												?
											</span>
										</Link>
									</div>
								</div>
							</div>
						)}
					</BookingModal>
				</div>
			</div>
		</div>
	);
};

BookingForm.propTypes = {
	isArtist: PropTypes.bool,
	artist: PropTypes.object,
	studio: PropTypes.object,
	hasLogin: PropTypes.bool,
	customerId: PropTypes.string
};
export default BookingForm;
