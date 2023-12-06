import { Alert, Avatar, BackgroundImg } from 'ui';
import PropTypes from 'prop-types';
import BookingModal from 'components/BookingModal';
import Link from 'next/link';
import ServicePage from './Studio/Service';
import { useState } from 'react';
import { fetcherPost, formatPrice } from 'lib';
import { BASE_URL } from 'lib/env';
import Router from 'next/router';

const estimeDate = [
	'Trong vòng 7 ngày tới',
	'Trong 2 tuần kế tiếp',
	'Trong tháng này',
	'Trong tháng sau',
	'Lúc nào cũng được'
];

const BookingForm = ({
	isArtist = true,
	artist,
	studio,
	hasLogin = true,
	customerId
}) => {
	const [description, setDescription] = useState('');
	const [time, setTime] = useState(0);
	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(0);
	const [selectedServices, setSelectedServices] = useState(new Map());

	const handleDescription = (e) => {
		setDescription(e.target.value);
	};
	const handleSelectChange = (isIncrease, service) => {
		if (isIncrease) {
			setMinPrice((prev) => prev + service.minPrice);
			setMaxPrice((prev) => prev + service.maxPrice);
		} else {
			setMinPrice((prev) => prev - service.minPrice);
			setMaxPrice((prev) => prev - service.maxPrice);
		}
		selectedServices.set(service.id, service.quantity);
	};

	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: false
	});

	const handleAlert = (state, title, content, isWarn = false) => {
		setShowAlert((prev) => state);
		setAlertContent({
			title: title,
			content: content,
			isWarn: isWarn
		});
	};
	const handleSubmit = () => {
		handleAlert(true, 'Đang đặt hẹn');
		let newDescription = `Ngày hẹn dự tính: ${estimeDate.at(time)}. ${description}`;
		const bookingServices = Array.from(selectedServices, ([key, value]) => ({
			serviceId: key,
			quantity: value
		})).filter((service) => service.quantity > 0);
		fetcherPost(`${BASE_URL}/customers/CreateBookingWithServices`, {
			studioId: studio.id,
			customerId: customerId,
			description: newDescription,
			serviceIds: bookingServices
		})
			.then((data) => {
				handleAlert(true, 'Đặt hẹn thành công');
				Router.replace('/booking');
			})
			.catch((e) => {
				handleAlert(true, 'Đặt hẹn thất bại', '', true);
			});
	};

	const handleRefresh = () => {
		Router.replace(window.location.href);
	};
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
			<div className="absolute -top-3 -left-5 -right-10 overflow-hidden h-noFooter">
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
									<div className="h-96 w-full overflow-auto">
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
															{artist && (
																<span className="ltr:mr-2 rtl:ml-2 text-sm ">
																	{artist.fullName}
																</span>
															)}
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
												Mô tả hình xăm bạn mong muốn:
											</h2>
											<form>
												{studio.services && (
													<div>
														<ServicePage
															onChange={handleSelectChange}
															services={studio.services}
														/>
													</div>
												)}
												<div>
													<div className="block mb-3">
														<label className=" text-lg">Mô tả thêm ý tưởng</label>
														<textarea
															aria-label="description"
															name="description"
															onChange={handleDescription}
															required
															className=" mt-4 mb-4 text-base appearance-none h-20 relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
															placeholder="Ví dụ: Tôi muốn hình xăm máy bay giấy kích thước vào khoảng 3-5cm và được xăm theo phong cách tối giản "
														/>
													</div>
												</div>

												<h2 className="text-lg mb-4">Bạn có thể đến xăm vào lúc?</h2>
												<div className="w-72">
													<select
														id="time"
														className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
													>
														{estimeDate.map((time, index) => (
															<option
																className={`${
																	index === time ? 'font-semibold bg-gray-50' : ''
																}`}
																onChange={() => setTime(index)}
																key={time}
																value={index}
															>
																{time}
															</option>
														))}
													</select>
												</div>
												<div className="mb-4">
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
