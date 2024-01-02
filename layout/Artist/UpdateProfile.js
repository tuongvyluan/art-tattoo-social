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

function UpdateArtistInfo({ account, onReload, setIsEdit }) {
	const { update, data } = useSession();
	const [defaultAccount, setDefaultAccount] = useState(account);
	const [profile, setProfile] = useState(JSON.parse(JSON.stringify(account)));
	const [isArtist, setIsArtist] = useState(account.styles);
	const [artistStyles, setArtistStyles] = useState(
		account.styles?.map((style) => style.id)
	);
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

	const styles = tattooStyleList;

	const handleSelectStyle = (styleId) => {
		const newStyle = JSON.parse(JSON.stringify(artistStyles));
		const index = newStyle.findIndex((style) => style === styleId);
		if (index < 0) {
			newStyle.push(styleId);
		} else {
			newStyle.splice(index, 1);
		}
		setArtistStyles(newStyle);
	};

	const handleFormChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	const handleUpdateArtist = async (newProfile, artistStyles) => {
		const promises = [];
		if (JSON.stringify(profile.styles) !== JSON.stringify(artistStyles)) {
			promises.push(
				fetcherPut(`${BASE_URL}/artists/${newProfile.id}/artist-style`, artistStyles)
			);
		}
		promises.push(
			fetcherPut(`${BASE_URL}/artist-profile`, newProfile)
		);
		await Promise.all(promises);
	};

	const handleCreateArtist = async (newProfile, artistStyles) => {
		await fetcherPost(`${BASE_URL}/Auth/CreateArtist`, {
			id: account.id,
			bioContent: newProfile.bioContent,
			status: 0,
			fullName: newProfile.fullName,
			avatar: newProfile.avatar
		})
			.then(() => {
				if (JSON.stringify(profile.styles) !== JSON.stringify(artistStyles)) {
					fetcherPut(
						`${BASE_URL}/artists/${newProfile.id}/artist-style`,
						artistStyles
					);
				}
			})
			.catch((e) => {
				console.log(e);
			});
	};

	const handleSubmit = async (newProfile, artistStyles, artistStudios) => {
		if (data?.user?.artistId) {
			await handleUpdateArtist(newProfile, artistStyles);
		} else {
			await handleCreateArtist(newProfile, artistStyles);
		}
	};

	const handleFormSubmit = () => {
		handleAlert(true, '', 'Đang cập nhật thông tin cá nhân', 0);
		handleSubmit(profile, artistStyles, studios).then(() => {
			update({
				...data,
				user: {
					...data?.user,
					artistId: profile.id,
					fullName: profile.fullName,
					avatar: profile.avatar
				}
			});
			onReload();
		});
	};

	const handleFormReset = () => {
		setProfile(JSON.parse(JSON.stringify(defaultAccount)));
		setArtistStyles(
			JSON.parse(JSON.stringify(defaultAccount.styles.map((style) => style.id)))
		);
		setStudios(JSON.parse(JSON.stringify(defaultAccount.studios)));
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
			<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56 flex justify-center">
				<Card className={'w-full max-w-2xl'}>
					<CardBody>
						<div method="post" className="pt-3">
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
												src={profile.avatar ? profile.avatar : '/images/avatar.png'}
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

								{account.role === ROLE.ARTIST && (
									<div className="block mb-3">
										<label>{'Bio'}</label>
										<textarea
											aria-label={'bioContent'}
											name="bioContent"
											type="text"
											value={profile.bioContent}
											onChange={handleFormChange}
											required
											rows={5}
											className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-base leading-none"
											placeholder={'Nhập bio cho tài khoản'}
										/>
									</div>
								)}
							</div>
							{
								// Artist styles
							}
							{isArtist && (
								<div className="pb-5">
									<div>
										<h1 className="border-b border-gray-300 pb-3 text-base mb-3">
											Tiệm xăm
										</h1>
										{studios ? (
											<div>
												{studios.map((studioArtist) => (
													<div
														key={studioArtist.createdAt}
														className="flex flex-wrap gap-2 items-center pb-3"
													>
														<Avatar
															size={50}
															src={
																studioArtist?.studioAvatar
																	? studioArtist?.studioAvatar
																	: '/images/ATL.png'
															}
														/>
														<div>
															<div className="text-base font-semibold">
																{studioArtist?.studioName}
															</div>
															<div>
																Từ {formatDate(studioArtist.createdAt)} đến{' '}
																{studioArtist.dismissedAt
																	? `${formatDate(studioArtist.dismissedAt)}`
																	: 'nay'}
															</div>
														</div>
													</div>
												))}
											</div>
										) : (
											<div>Bạn không làm việc cho tiệm xăm nào</div>
										)}
									</div>
									<div className="py-5">
										<h1 className="border-b border-gray-300 pb-3 text-base">
											Style
										</h1>
										<div className="py-2 flex flex-wrap gap-2">
											{styles.map((style, index) => (
												<div
													className="cursor-pointer"
													onClick={() => handleSelectStyle(style.id)}
													key={style.id}
												>
													<Pill
														selected={
															artistStyles.findIndex((item) => item === style.id) >=
															0
														}
													>
														{style.name}
													</Pill>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
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
	);
}

UpdateArtistInfo.propTypes = {
	account: PropTypes.object.isRequired,
	onReload: PropTypes.func,
	setIsEdit: PropTypes.func
};

export default UpdateArtistInfo;
