import Button from 'components/Button';
import Pill from 'components/Pill';
import { fetcherPost, fetcherPut, formatDate } from 'lib';
import { BASE_URL, UPLOAD_PRESET } from 'lib/env';
import { ROLE } from 'lib/status';
import { tattooStyleList } from 'lib/tattooStyle';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { MdUpload } from 'react-icons/md';
import { Alert, Avatar, Card, CardBody } from 'ui';
import MyInput from 'components/MyInput';
import { ChevronLeft } from 'icons/outline';
import Heading from 'components/Heading';

function UpdateCustomerInfo({ account, onReload, setIsEdit }) {
	const { update, data } = useSession();
	const [defaultAccount, setDefaultAccount] = useState(account);
	const [profile, setProfile] = useState(JSON.parse(JSON.stringify(account)));
	const [studios, setStudios] = useState(account.studios);
	const [avatarKey, setAvatarKey] = useState(account.avatar);
	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: false
	});

	const handleAlert = (state, title, content, isWarn = false) => {
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

	const handleFormChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	const handleUpdateCustomer = async (newProfile) => {
		await fetcherPut(`${BASE_URL}/customers/${account.customerId}`, {
			accountId: account.id,
			fullName: newProfile.fullName,
			avatar: newProfile.avatar
		});
	};

	const handleSubmit = async (newProfile) => {
		await handleUpdateCustomer(newProfile);
	};

	const handleFormSubmit = () => {
		handleAlert(true, '', 'Đang cập nhật thông tin cá nhân', 0);
		handleSubmit(profile).then(() => {
			update({
				...data,
				user: {
					...data?.user,
					fullName: profile.fullName,
					avatar: profile.avatar
				}
			});
			onReload();
		});
	};

	const handleFormReset = () => {
		setProfile(JSON.parse(JSON.stringify(defaultAccount)));
	};

	useEffect(() => {
		setAvatarKey(profile.avatar);
	}, [profile]);

	return (
		<div className="relative">
			<Alert
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				color={alertContent.isWarn}
				className="bottom-2 right-2 fixed max-w-md z-50"
			>
				<strong className="font-bold mr-1">{alertContent.title}</strong>
				<span className="block sm:inline">{alertContent.content}</span>
			</Alert>
			<div className="sm:px-12 md:px-16 lg:px-20 flex justify-center">
				<div>
					<Card className={'min-w-md md:min-w-xl lg:min-w-3xl'}>
						<CardBody>
							<div method="post">
								<div>
									<div className="flex flex-wrap gap-3 items-center border-b border-gray-300">
										<div className="cursor-pointer pb-2 flex gap-1 text-gray-500 hover:text-indigo-500">
											<ChevronLeft
												onClick={() => {
													setIsEdit();
												}}
												width={20}
												heigh={20}
											/>
										</div>
										<Heading>Thông tin cá nhân</Heading>
									</div>
									<div className="w-full min-w-min py-3">
										<div className="flex justify-center">
											<div key={avatarKey}>
												<Avatar
													circular={true}
													src={
														profile.avatar ? profile.avatar : '/images/avatar.png'
													}
													alt={'Avatar'}
													size={150}
												/>
											</div>
										</div>
										<div className="flex flex-wrap items-center mt-3">
											<div className="mx-auto">
												<CldUploadButton
													onSuccess={(result, options) =>
														handleFormChange({
															target: { name: 'avatar', value: result.info?.url }
														})
													}
													uploadPreset={UPLOAD_PRESET}
													className="text-gray-800 bg-white ring-1 ring-gray-300 hover:text-white hover:bg-gray-700 font-medium rounded-lg text-sm py-2 px-2 w-full"
												>
													<div className="flex gap-1 items-center">
														<MdUpload size={16} />
														<div>Thay avatar</div>
													</div>
												</CldUploadButton>
											</div>
										</div>
									</div>
									<div className="w-full mb-3">
										<label>{'Tên'}</label>
										<MyInput
											aria-label={'fullName'}
											name="fullName"
											type="text"
											value={profile.fullName}
											onChange={handleFormChange}
											required
											placeholder={'Tên'}
										/>
									</div>
								</div>
								<div className="flex justify-end w-full">
									<div className="flex justify-end gap-2">
										<div className="w-16">
											<Button reset={true} onClick={handleFormReset} outline>
												Reset
											</Button>
										</div>
										<div className="w-16">
											<Button onClick={handleFormSubmit}>Lưu</Button>
										</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}

UpdateCustomerInfo.propTypes = {
	account: PropTypes.object.isRequired,
	onReload: PropTypes.func,
	setIsEdit: PropTypes.func
};

export default UpdateCustomerInfo;
