import Button from 'components/Button';
import MyModal from 'components/MyModal';
import Register from 'components/Register';
import { fetcherPost } from 'lib';
import { BASE_URL } from 'lib/env';
import { ROLE } from 'lib/status';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { MdCheck, MdOutlineErrorOutline } from 'react-icons/md';
import { Loading } from 'ui';

const RegisterPage = () => {
	const { status } = useSession();

	useEffect(() => {
		if (status === 'authenticated') {
			Router.replace('/');
		}
	}, [status]);

	const [user, setUser] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		password: '',
		cpassword: '',
		role: ROLE.CUSTOMER
	});
	const [showModal, setShowModal] = useState(false);

	const [modalContent, setModalContent] = useState({
		title: '',
		content: '',
		isWarn: 0
	});

	const handleSetUser = (newUser) => {
		handleModal(false, '', '');
		setUser(newUser);
	};

	const handleModal = (state, title, content, status = 0) => {
		setShowModal((prev) => state);
		setModalContent({
			title: title,
			content: content,
			isWarn: status
		});
	};

	const getModalIcon = () => {
		switch (modalContent.isWarn) {
			case 1:
				return <MdCheck className="text-green-500" size={30} />;
			case 2:
				return <MdOutlineErrorOutline className="text-red-500" size={30} />;
			default:
				return <Loading size={30} />;
		}
	};

	const handleCloseModal = () => {
		if (modalContent?.isWarn === 2) {
			setShowModal(false);
		} else {
			Router.replace('/auth/signin');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user.cpassword !== user.password) {
			handleModal(true, '', 'Mật khẩu xác nhận không trùng khớp.', true);
		} else {
			handleModal(true, '', 'Đang đăng ký tài khoản...');

			try {
				fetcherPost(`${BASE_URL}/Auth/Register`, {
					...user,
					redirect: false
				})
					.then((data) => {
						console.log(data);
						handleModal(
							true,
							'Đăng ký tài khoản thành công',
							'Bạn hãy kiểm tra mail để xác thực tài khoản nhé.',
							1
						);
					})
					.catch((e) => {
						console.log(e);
						handleModal(true, 'Đăng ký tài khoản thất bại', '', 2);
					});
			} catch (e) {
				console.log(e);
				let mesageTitle = 'Đăng ký tài khoản không thành công.';
				let messageContent = '';
				if (e.message.includes('already an account')) {
					messageContent = 'Email hoặc số điện thoại này đã tồn tại.';
				}
				handleModal(true, mesageTitle, messageContent, 2);
			}
		}
	};

	return (
		<div className="relative">
			<MyModal
				noHeader={true}
				openModal={showModal}
				setOpenModal={setShowModal}
				title={'Đăng ký tài khoản'}
				noFooter={true}
			>
				<div className="flex justify-center">
					<div className="text-center">
						<div className="flex flex-wrap  gap-2 items-center pb-4">
							<div>{getModalIcon()}</div>
							<div className="text-2xl">{modalContent?.title}</div>
						</div>
						<div className="text-base">{modalContent?.content}</div>
					</div>
				</div>
				{modalContent?.isWarn !== 0 && (
					<div className="pt-6 mt-6 border-t border-gray-300 flex justify-center">
						<Button outline onClick={handleCloseModal}>
							{modalContent?.isWarn === 2 ? 'Đóng' : 'Trở lại trang đăng nhập'}
						</Button>
					</div>
				)}
			</MyModal>
			<Register user={user} setUser={handleSetUser} handleSubmit={handleSubmit} />
		</div>
	);
};

RegisterPage.getInitialProps = async () => ({
	namespacesRequired: ['register']
});

export default RegisterPage;
