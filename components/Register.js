import PropTypes from 'prop-types';
import { Logo } from 'ui';

import Button from './Button';
import { ROLE } from 'lib/status';
import MyInput from './MyInput';
import Link from 'next/link';

const Register = ({ user, setUser, handleSubmit }) => {
	const handleFormChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handleCheckbox = () => {
		if (user.role === ROLE.CUSTOMER) {
			setUser({ ...user, role: ROLE.ARTIST });
		} else {
			setUser({ ...user, role: ROLE.CUSTOMER });
		}
	};

	return (
		<div className="flex flex-col justify-center items-center px-3 bg-white dark:bg-gray-600 min-h-screen">
			<div className="w-full max-w-screen-xl">
				<div className="w-full flex justify-center mx-0 mt-5">
					<div className="w-full md:w-4/5 px-5 flex justify-center">
						<div className="w-full max-w-xl">
							<Link href={'/'}>
								<div className="text-center mb-5 text-gray-700 cursor-pointer">
									<Logo height={50} width={50} />
								</div>
							</Link>
							<form onSubmit={handleSubmit}>
								<div className="text-center mb-5">
									<h1 className="uppercase text-2xl mb-3 font-bold leading-none text-gray-700">
										Art Tattoo Lover
									</h1>
									<p className="text-gray-800">
										Tạo tài khoản để mở Studio và sử dụng dịch vụ quản lí tiệm xăm
										của Art Tattoo Lover Platform
									</p>
								</div>

								<div className="rounded-lg shadow-sm">
									<div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
										<div>
											<div className="block mb-3">
												<label>{'Tên'}</label>
												<MyInput
													aria-label={'Full name'}
													name="fullName"
													value={user.fullName}
													onChange={handleFormChange}
													type="text"
													required
													placeholder={'Tên'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Số điện thoại'}</label>
												<MyInput
													aria-label={'Phone'}
													name="phoneNumber"
													value={user.phoneNumber}
													onChange={handleFormChange}
													type="tel"
													required
													placeholder={'Email'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Email'}</label>
												<MyInput
													aria-label={'Email'}
													name="email"
													value={user.email}
													onChange={handleFormChange}
													type="email"
													required
													placeholder={'Email'}
												/>
											</div>
										</div>
										<div>
											<div className="block mb-3">
												<label>{'Password'}</label>
												<MyInput
													aria-label={'Password'}
													name="password"
													value={user.password}
													onChange={handleFormChange}
													type="password"
													required
													placeholder={'Password'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Xác nhận password'}</label>
												<MyInput
													aria-label={'cpassword'}
													name="cpassword"
													value={user.cpassword}
													onChange={handleFormChange}
													type="password"
													required
													placeholder={'Xác nhận password'}
												/>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-1 mb-3">
										<input
											type="checkbox"
											name="role"
											onChange={handleCheckbox}
											checked={user.role !== ROLE.CUSTOMER}
										/>
										<label className="cursor-pointer" onClick={handleCheckbox}>
											Tạo tài khoản nghệ sĩ xăm
										</label>
									</div>
								</div>

								<div className="flex justify-center">
									<div className="w-full max-w-md">
										<Button>Đăng ký</Button>
									</div>
								</div>
							</form>
							<div className="text-center pb-3">
								<small className="text-gray-700 text-center">
									<span>{'Đã có tài khoản?'}</span>{' '}
									<Link href="/auth/signin">
										<a>{'Đăng nhập tại đây'}</a>
									</Link>
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Register.propTypes = {
	user: PropTypes.object.isRequired,
	setUser: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired
};
export default Register;
