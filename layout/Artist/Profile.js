import CryptoJS from 'crypto-js';
import Button from 'components/Button';
import Pill from 'components/Pill';
import { Tooltip } from 'flowbite-react';
import { fetcher, formatDate, formatMonthYear, formatPhoneNumber } from 'lib';
import { ROLE } from 'lib/status';
import { tattooStyleList } from 'lib/tattooStyle';
import { useSession } from 'next-auth/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Avatar, Card, CardBody } from 'ui';
import UpdateArtistInfo from './UpdateProfile';
import Heading from 'components/Heading';
import { API_SECRET, BASE_URL } from 'lib/env';
import ChartComponent from 'layout/ChartComponent';
import { sharedOptions, gridOptions, colors } from 'lib/chartHelper';

function ArtistInfo({ account, onReload }) {
	const { data } = useSession();
	const [profile, setProfile] = useState(JSON.parse(JSON.stringify(account)));
	const [isArtist, setIsArtist] = useState(account.styles);
	const [artistStyles, setArtistStyles] = useState(
		account.styles?.map((style) => style.id)
	);
	const [studios, setStudios] = useState(account.studios);
	const [avatarKey, setAvatarKey] = useState(account.avatar);
	const [isEdit, setIsEdit] = useState(false);
	const [labels, setLabels] = useState(undefined);
	const [dataSet, setDataSet] = useState([]);

	const copyKey = () => {
		const id = account.id;
		const time = new Date().getTime();
		const key = {
			id: id,
			key: time
		};
		navigator.clipboard.writeText(
			CryptoJS.AES.encrypt(JSON.stringify(key), API_SECRET).toString()
		);
	};

	const styles = tattooStyleList;

	useEffect(() => {
		fetcher(`${BASE_URL}/dashboard/tattoo?artistId=${account.id}`).then(
			(response) => {
				setDataSet([
					{
						label: 'Tổng số hình xăm',
						type: 'bar',
						data: response.sta?.map((s) => s.noOfTattoo),
						...colors[0]
					}
				]);
				setLabels(response.sta?.map((s) => formatMonthYear(s.month)));
			}
		);
	}, []);

	return (
		<div className="relative">
			{isEdit ? (
				<div>
					{isArtist ? (
						<UpdateArtistInfo
							account={account}
							onReload={onReload}
							setIsEdit={() => setIsEdit(false)}
						/>
					) : (
						<div></div>
					)}
				</div>
			) : (
				<div className="sm:px-12 md:px-16 lg:px-20 flex justify-center">
					<div className={isArtist ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}>
						<Card className={'w-full'}>
							<CardBody>
								<div className="">
									<div>
										<div className="border-b border-gray-300 text-base">
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
										</div>
										<div className="w-full mb-3 flex flex-wrap gap-1 items-end">
											<label className="w-24">{'Tên:'}</label>
											<div className="text-base">{profile.fullName}</div>
										</div>
										<div className="w-full mb-3 flex flex-wrap gap-1 items-end">
											<label className="w-24">{'Số điện thoại:'}</label>
											<div className="text-base">{formatPhoneNumber(profile.phoneNumber)}</div>
										</div>
										<div className="w-full mb-3 flex flex-wrap gap-1 items-end">
											<label className="w-24">{'Email:'}</label>
											<div className="text-base">{profile.email}</div>
										</div>

										{account.role === ROLE.ARTIST && (
											<div className="w-full mb-3 flex flex-wrap gap-1 items-end">
												<label className="w-24">{'Giới thiệu:'}</label>
												<div className="text-base">{profile.bioContent}</div>
											</div>
										)}
									</div>
									{
										// Artist styles
									}
									{isArtist && (
										<div className="pb-5">
											<div className="py-5">
												<h1 className="border-b border-gray-300 pb-3 text-base font-semibold">
													Style
												</h1>
												<div className="py-2 flex flex-wrap gap-2">
													{styles.map((style, index) => (
														<div className="cursor-pointer" key={style.id}>
															<Pill
																canHover={false}
																selected={
																	artistStyles.findIndex(
																		(item) => item === style.id
																	) >= 0
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
												<Button onClick={() => setIsEdit(true)}>Sửa</Button>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						{isArtist && (
							<Card>
								<CardBody>
									<div>
										<div className="border-b border-gray-300 text-base">
											<Heading>Thống kê</Heading>
										</div>
										{
											<div className="border-b border-gray-300 py-3 pl-3">
												<div className="flex justify-between flex-wrap gap-3">
													<h1 className="text-base font-semibold mb-3">Tiệm xăm</h1>
													{isArtist &&
														data?.user?.artistId &&
														account.studios?.at(0)?.dismissedAt !== null && (
															<div>
																<Tooltip content="Copy key gửi tiệm xăm để gia nhập tiệm xăm">
																	<Button onClick={() => copyKey()}>Lấy key</Button>
																</Tooltip>
															</div>
														)}
												</div>
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
										}
										{labels && (
											<ChartComponent
												type={'bar'}
												title="Số hình xăm từng tháng trong 12 tháng vừa qua"
												options={{
													...sharedOptions,
													...gridOptions
												}}
												data={{ labels: labels, datasets: dataSet }}
											/>
										)}
									</div>
								</CardBody>
							</Card>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

ArtistInfo.propTypes = {
	account: PropTypes.object.isRequired,
	onReload: PropTypes.func
};

export default ArtistInfo;
