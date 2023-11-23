import Button from 'components/Button';
import Pill from 'components/Pill';
import { tattooStyleList } from 'lib/tattooStyle';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Card, CardBody } from 'ui';

function ArtistInfo({ account, handleSubmit }) {
	const [profile, setProfile] = useState(JSON.parse(JSON.stringify(account)));
	const [isArtist, setIsArtist] = useState(false);
	const [artistStyles, setArtistStyles] = useState([]);
	const [artistStudios, setArtistStudios] = useState([]);

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

	const handleFormSubmit = (e) => {
		e.preventDefault();
		handleSubmit({
			account: profile,
			artistStyles: artistStyles,
			artistStudios: artistStudios
		});
	};

	const handleFormReset = () => {
		setProfile(JSON.parse(JSON.stringify(account)));
		setArtistStyles(JSON.parse(JSON.stringify(account.styles)));
		setArtistStudios(JSON.parse(JSON.stringify(account.studios)));
	};

	useEffect(() => {
		if (account.styles) {
			setArtistStyles(JSON.parse(JSON.stringify(account.styles)));
			setArtistStudios(JSON.parse(JSON.stringify(account.studios)));
			setIsArtist(true);
		}
	}, []);
	return (
		<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56 flex justify-center">
			<Card className={'w-full max-w-2xl'}>
				<CardBody>
					<form method="post" className="pt-3" onSubmit={handleFormSubmit}>
						<div>
							<h1 className="border-b border-gray-300 pb-3 text-base">
								Thông tin cá nhân
							</h1>
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

							<div className="block mb-3">
								<label>{'Địa chỉ'}</label>
								<input
									aria-label={'address'}
									name="address"
									type="text"
									value={profile.address}
									onChange={handleFormChange}
									required
									className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
									placeholder={'Địa chỉ'}
								/>
							</div>

							<div className="block mb-3">
								<label>{'Điện thoại'}</label>
								<input
									aria-label={'phoneNumber'}
									name="phoneNumber"
									type="tel"
									value={profile.phoneNumber}
									onChange={handleFormChange}
									required
									className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
									placeholder={'Điện thoại'}
								/>
							</div>

							{account.bio && (
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
										placeholder={'Nhập bio cho studio'}
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
											<Pill selected={artistStyles.findIndex((item) => item === style.id) >= 0}>
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
								<Button>Lưu</Button>
							</div>
						</div>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}

ArtistInfo.propTypes = {
	account: PropTypes.object.isRequired,
	handleSubmit: PropTypes.func
};

export default ArtistInfo;
