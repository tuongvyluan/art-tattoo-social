import { BackgroundImg, Logo } from 'ui';
import PropTypes from 'prop-types';
import Button from './Button';
import { signIn } from 'next-auth/react';
import GoogleLogo from '/public/svg/google.svg';
import MyInput from './MyInput';
import Link from 'next/link';
import { Modal } from 'flowbite-react';

const Login = ({ handleSubmit, user, setUser }) => {
	const handleFormChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	return (
		<div className="relative">
			<div className="absolute -top-3 -left-5 -right-10 h-screen">
				<BackgroundImg
					image={'/images/booking-img.jpg'}
					className="relative w-full h-full bg-center bg-cover bg-fallback"
				/>
				<div className="relative h-noFooter">
					<Modal size={'xl'} position={'center'} show={true}>
						<Modal.Body>
							<div className="flex flex-col justify-center items-center px-3 bg-white h-5/6 overflow-auto">
								<div className="w-full max-w-screen-xl">
									<div className="w-full flex justify-center mx-0">
										<div className="w-full md:w-2/3 px-2 flex justify-center">
											<div className="w-full max-w-md">
												<Link href={'/'}>
													<div className="text-center mb-5 text-gray-700 cursor-pointer">
														<Logo height={50} width={50} />
													</div>
												</Link>
												<form className="sign-in-form" onSubmit={handleSubmit}>
													<div className="text-center mb-5">
														<h1 className="uppercase text-2xl mb-3 font-bold leading-none ">
															Art Tattoo Lover
														</h1>
														<p className="text-gray-800">
															Đăng nhập để sử dụng dịch vụ quản lí tiệm xăm của Art
															Tattoo Lover Platform
														</p>
													</div>

													<div className="rounded-lg shadow-sm">
														<div className="block mb-3">
															<label>Email</label>
															<MyInput
																aria-label={'Email'}
																name="email"
																type="email"
																value={user.email}
																onChange={handleFormChange}
																required
																placeholder={'Email'}
															/>
														</div>
														<div className="block mb-3">
															<label>Password</label>
															<MyInput
																aria-label={'Password'}
																name="password"
																type="password"
																value={user.password}
																onChange={handleFormChange}
																required
																placeholder={'Password'}
															/>
														</div>
													</div>

													<div className="flex justify-center">
														<Button>Đăng nhập</Button>
													</div>
												</form>

												<div className="flex justify-center pt-3">
													<Button outline onClick={() => signIn('google')}>
														<div className="flex flex-wrap gap-2 items-center justify-center">
															<GoogleLogo className="w-4 h-4" />
															<div>Đăng nhập với Google</div>
														</div>
													</Button>
												</div>
												<div className="text-center">
													<small className="text-gray-700 text-center">
														<span>Chưa có tài khoản?</span>{' '}
														<Link href="/auth/register">
															<a>Tạo tài khoản mới</a>
														</Link>
													</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Modal.Body>
					</Modal>
				</div>
			</div>
		</div>
	);
};
Login.propTypes = {
	handleSubmit: PropTypes.func,
	user: PropTypes.object,
	setUser: PropTypes.func
};
export default Login;
