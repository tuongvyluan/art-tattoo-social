import Button from 'components/Button';
import Pill from 'components/Pill';
import { fetcherPut } from 'lib';
import { BASE_URL, UPLOAD_PRESET } from 'lib/env';
import { ROLE } from 'lib/status';
import { tattooStyleList } from 'lib/tattooStyle';
import { useSession } from 'next-auth/react';
import { CldUploadButton } from 'next-cloudinary';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { MdUpload } from 'react-icons/md';
import { Alert, Avatar, Card, CardBody } from 'ui';

function ArtistInfo({ account, onReload }) {
	const { update, data } = useSession();
	const [defaultAccount, setDefaultAccount] = useState(account);
	const [profile, setProfile] = useState(JSON.parse(JSON.stringify(account)));
	const [isArtist, setIsArtist] = useState(false);
	const [artistStyles, setArtistStyles] = useState(
		account.styles.map((style) => style.id)
	);
	const [artistStudios, setArtistStudios] = useState([]);
	const [avatarKey, setAvatarKey] = useState(account.avatar);
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

	const styles = tattooStyleList;

	const handleSelectStyle = (styleId) => {
		const newStyle = JSON.parse(JSON.stringify(artistStyles));
		const index = newStyle.findIndex((style) => style === styleId);
		if (index < 0) {
			newStyle.push(styleId);
		} else {
			newStyle.splice(index, 1);
		}
		console.log(newStyle);
		setArtistStyles(newStyle);
	};

	const handleFormChange = (e) => {
		setProfile({ ...profile, [e.target.name]: e.target.value });
	};

	const handleSubmit = (newProfile, artistStyles, artistStudios) => {
		if (JSON.stringify(profile.styles) !== JSON.stringify(artistStyles)) {
			fetcherPut(`${BASE_URL}/artists/${newProfile.id}/artist-style`, artistStyles);
		}
		fetcherPut(`${BASE_URL}/artist-profile`, newProfile).then(() => {
			if (newProfile.avatar !== account.avatar) {
				update({
					...data,
					user: {
						...data?.user,
						avatar: newProfile.avatar
					}
				});
				onReload()
			}
		});
	};

	const handleFormSubmit = () => {
		handleSubmit(profile, artistStyles, artistStudios);
		setDefaultAccount({
			...profile,
			styles: artistStyles.map((style) => {
				return {
					id: style
				};
			}),
			artistStudios: artistStudios
		});
		handleAlert(true, 'Cập nhật thông tin cá nhân thành công');
	};

	const handleFormReset = () => {
		setProfile(JSON.parse(JSON.stringify(defaultAccount)));
		setArtistStyles(
			JSON.parse(JSON.stringify(defaultAccount.styles.map((style) => style.id)))
		);
		setArtistStudios(JSON.parse(JSON.stringify(defaultAccount.studios)));
	};

	useEffect(() => {
		if (account.styles) {
			setArtistStyles(
				JSON.parse(JSON.stringify(account.styles.map((style) => style.id)))
			);
			setArtistStudios(JSON.parse(JSON.stringify(account.studios)));
			setIsArtist(true);
		}
	}, []);

	useEffect(() => {
		setAvatarKey(profile.avatar);
	}, [profile]);

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
			<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56 flex justify-center">
				<Card className={'w-full max-w-2xl'}>
					<CardBody>
						<div method="post" className="pt-3">
							<div>
								<h1 className="border-b border-gray-300 pb-3 text-base">
									Thông tin cá nhân
								</h1>
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
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pt-2">
									<div className="w-full pb-0">
										<label>{'Họ'}</label>
										<input
											aria-label={'firstName'}
											name="firstName"
											type="text"
											value={profile.firstName}
											onChange={handleFormChange}
											required
											className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
											placeholder={'Họ'}
										/>
									</div>
									<div className="w-full">
										<label>{'Tên'}</label>
										<input
											aria-label={'lastName'}
											name="lastName"
											type="text"
											value={profile.lastName}
											onChange={handleFormChange}
											required
											className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
											placeholder={'Tên'}
										/>
									</div>
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
											className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
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
									<h1 className="border-b border-gray-300 pb-3 text-base">Style</h1>
									<div className="py-2 flex flex-wrap gap-2">
										{styles.map((style, index) => (
											<div
												className="cursor-pointer"
												onClick={() => handleSelectStyle(style.id)}
												key={style.id}
											>
												<Pill
													selected={
														artistStyles.findIndex((item) => item === style.id) >= 0
													}
												>
													{style.name}
												</Pill>
											</div>
										))}
									</div>
								</div>
							)}
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
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

ArtistInfo.propTypes = {
	account: PropTypes.object.isRequired,
	onReload: PropTypes.func
};

export default ArtistInfo;
