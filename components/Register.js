import PropTypes from 'prop-types';
import { Link, Logo } from 'ui';

import Button from './Button';
import { ROLE } from 'lib/status';

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
							<div className="text-center mb-5 text-gray-700">
								<Logo height={50} width={50} />
							</div>
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
												<input
													aria-label={'Full name'}
													name="fullName"
													value={user.fullName}
													onChange={handleFormChange}
													type="text"
													required
													className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
													placeholder={'Tên'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Số điện thoại'}</label>
												<input
													aria-label={'Phone'}
													name="phoneNumber"
													value={user.phoneNumber}
													onChange={handleFormChange}
													type="tel"
													required
													className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
													placeholder={'Email'}
												/>
											</div>
										</div>
										<div>
											<div className="block mb-3">
												<label>{'Email'}</label>
												<input
													aria-label={'Email'}
													name="email"
													value={user.email}
													onChange={handleFormChange}
													type="email"
													required
													className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
													placeholder={'Email'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Password'}</label>
												<input
													aria-label={'Password'}
													name="password"
													value={user.password}
													onChange={handleFormChange}
													type="password"
													required
													className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
													placeholder={'Password'}
												/>
											</div>
											<div className="block mb-3">
												<label>{'Xác nhận password'}</label>
												<input
													aria-label={'cpassword'}
													name="cpassword"
													value={user.cpassword}
													onChange={handleFormChange}
													type="password"
													required
													className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
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
									<div className='w-full max-w-md'>
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
