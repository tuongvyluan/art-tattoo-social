import { Avatar, BackgroundImg } from 'ui';
import Button from 'components/Button';
import { UPLOAD_PRESET } from 'lib/env';
import PropTypes from 'prop-types';
import Footer from './Footer';
import MyModal from 'components/MyModal';
import BookingModal from 'components/BookingModal';
import Link from 'next/link';

const BookingForm = ({ isArtist = true, artist, studio, hasLogin = true }) => {
	const handleSubmit = () => {
		console.log(artist);
	};
	return (
		<div className="absolute top-0 left-0 -right-5 overflow-hidden h-noFooter">
			<BackgroundImg
				image={'/images/booking-img.jpg'}
				className="relative w-full h-full bg-center bg-cover bg-fallback"
			/>
			<div className="relative h-noFooter">
				<BookingModal canConfirm={hasLogin} onSubmit={handleSubmit}>
					{hasLogin ? (
						<div className="w-full h-96 overflow-auto">
							<div>
								{/* <!-- Hiển thị tên studio --> */}
								<div className="flex bg-white flex-row w-0 min-w-full">
									<div className="flex justify-between items-center py-4 px-2">
										<div className="flex items-center">
											<div>
												<Avatar size={50} src={`images`} alt={`avatar`} />
											</div>
											<div className="flex flex-row ltr:ml-6 rtl:mr-6 ">
												<div className="sm:inline-block text-base flex flex-row  font-medium ml-2">
													<p className="ltr:mr-2 rtl:ml-2 font-bold">
														Studio nameaaaaaaaa
													</p>
													<span className="ltr:mr-2 rtl:ml-2 text-sm ">
														Artist firstName
													</span>
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
										<div></div>
										<div>
											<div className="block mb-3">
												<label className=" text-lg">Mô tả thêm ý tưởng</label>
												<textarea
													//   aria-label={t("fullName")}
													name="name"
													required
													className=" mt-4 mb-4 text-base appearance-none h-20 relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
													placeholder="Ví dụ: Tôi muốn hình xăm máy bay giấy kích thước vào khoảng 3-5cm và được xăm theo phong cách tối giản "
												/>
											</div>
										</div>
										<h2 className="text-lg mb-4">Hình tham khảo:</h2>
										{/* thêm hình ảnh */}
										<div className="flex">
											<div className="pb-4">
												<Button
													onSuccess={(result, options) =>
														handleUploadImage(result, options, stageIndex)
													}
													uploadPreset={UPLOAD_PRESET}
												>
													+ Thêm hình
												</Button>
											</div>
										</div>
										{/* hiện hình ảnh */}
										<h2 className="text-lg mb-4">Thời gian</h2>
										<select
											id="countries"
											className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										>
											<option value="US">Vài ngày tới</option>
											<option value="CA">Tuần sau</option>
											<option value="FR">Vài tuần sau</option>
											<option value="DE">Trong vài tháng tới</option>
										</select>
										<h2 className="text-lg mb-4">Giá dịch vụ ước tính</h2>
									</form>
								</div>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-full">
							<div>
								<div className='text-center'>Bạn phải đăng nhập để được đặt lịch</div>
								<div className='text-center'>
									Đi tới trang{' '}
									<Link href="/auth/signin" target="_blank">
										<span className="underline cursor-pointer text-blue-700">đăng nhập</span>
									</Link>
									/
									<Link href="/auth/register" target="_blank">
										<span className="underline cursor-pointer text-blue-700">đăng ký</span>
									</Link>
									?
								</div>
							</div>
						</div>
					)}
				</BookingModal>
			</div>
		</div>
	);
};

BookingForm.propTypes = {
	isArtist: PropTypes.bool,
	artist: PropTypes.object,
	studio: PropTypes.object,
	hasLogin: PropTypes.bool
};
export default BookingForm;
