import { ChevronDown, ChevronLeft } from 'icons/solid';
import { MdUpload } from 'react-icons/md';
import {
	Alert,
	Avatar,
	BackgroundImg,
	Card,
	CardBody,
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Link
} from 'ui';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from 'components/Button';
import { fetcherPost, fetcherPut, formatPrice } from 'lib';
import { CldUploadButton } from 'next-cloudinary';
import { generateSHA1, generateSignature } from 'lib/cloudinary_signature';
import { AiOutlineClose } from 'react-icons/ai';
import { extractPublicId } from 'cloudinary-build-url';
import { operationNames, stringPlacements, stringSize, stringTattooStages } from 'lib/status';
import { tattooStyleById, tattooStyleList } from 'lib/tattooStyle';
import { BASE_URL } from 'lib/env';
import { v4 } from 'uuid';
import CldButton from 'components/CldButton';

const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

const stageMapMedia = (stages) => {
	return new Map(
		stages.map((stage) => {
			return [stage.id, stage.medias];
		})
	);
};

const deepCopyMap = (map) => {
	return new Map(JSON.parse(JSON.stringify(Array.from(map))));
};

function TattooDetailsPage({ bookingId, artTattoo, handleSubmit }) {
	const [defaultTattoo, setDefaultTattoo] = useState(
		JSON.parse(JSON.stringify(artTattoo))
	);
	const [tattoo, setTattoo] = useState(defaultTattoo);
	const [thumbnail, setThumbnail] = useState(defaultTattoo.thumbnail);
	const [mediaMap, setMediaMap] = useState(stageMapMedia(defaultTattoo.stages));
	const [hasStageChange, setHasStageChange] = useState(false);
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

	const handleStageChange = (e, stageIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const stages = tattoo.stages;
		const stage = {
			...stages.at(stageIndex),
			[e.target.name]: e.target.value
		};
		stages[stageIndex] = stage;
		setTattoo({ ...JSON.parse(JSON.stringify(tattoo)), stages: stages });
	};

	// delete image from the cloudinary storage
	const deleteCloudinaryImage = (imgUrl) => {
		const publicId = extractPublicId(imgUrl);
		const timestamp = new Date().getTime();
		const signature = generateSHA1(generateSignature(publicId, API_SECRET));
		const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

		fetcherPost(url, {
			public_id: publicId,
			signature: signature,
			api_key: API_KEY,
			timestamp: timestamp
		});
	};

	// handle when pressing delete image button
	const handleDeleteCloudinaryImage = (imgUrl, stageIndex, mediaIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const newMap = deepCopyMap(mediaMap);
		const stages = tattoo.stages;
		const medias = newMap.get(stages.at(stageIndex).id);
		const image = medias.at(mediaIndex);
		// If this image was recently added and its link hasn't been saved to db, completely remove it from cloudinary
		if (!image.saved) {
			deleteCloudinaryImage(imgUrl);
		}
		medias.splice(mediaIndex, 1);
		newMap.set(stages.at(stageIndex).id, medias);
		setMediaMap(newMap);
	};

	const handleUploadImage = (result, options, stageIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const newMap = deepCopyMap(mediaMap);
		const stages = tattoo.stages;
		const medias = newMap.get(stages.at(stageIndex).id);
		medias.push({
			id: v4(),
			url: result.info?.url,
			description: '',
			isPublicized: false,
			saved: false
		});
		newMap.set(stages.at(stageIndex).id, medias);
		setMediaMap(newMap);
	};

	const handlePublicImage = (stageIndex, mediaIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const newMap = deepCopyMap(mediaMap);
		const stages = tattoo.stages;
		const medias = newMap.get(stages.at(stageIndex).id);
		medias[mediaIndex] = {
			...medias[mediaIndex],
			isPublicized: !medias[mediaIndex].isPublicized
		};
		newMap.set(stages.at(stageIndex).id, medias);
		setMediaMap(newMap);
	};

	const handleAddStage = () => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const newMap = deepCopyMap(mediaMap);
		const stages = tattoo.stages;
		const newId = v4();
		stages.push({
			id: newId,
			stageStyle: 0,
			description: '',
			medias: []
		});
		newMap.set(newId, []);
		setTattoo({ ...tattoo, stages: stages });
		setMediaMap(newMap);
	};

	const handleRemoveStage = (stageIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const stages = tattoo.stages;
		stages.splice(stageIndex, 1);
		setTattoo({ ...tattoo, stages: stages });
	};

	const setTattooState = (key, newValue) => {
		if (tattoo[key] !== newValue) {
			setTattoo({ ...tattoo, [key]: newValue });
		}
	};

	const handleResetChange = () => {
		const stages = tattoo.stages;
		const stageLength = stages.length;
		let i = 0;
		let j;
		let medias;
		for (i; i < stageLength; i++) {
			medias = stages.at(i).medias;
			for (j = 0; j < medias.length; j++) {
				if (!medias.at(j).saved) {
					deleteCloudinaryImage(medias.at(j).url);
				}
			}
		}
		setTattoo(JSON.parse(JSON.stringify(defaultTattoo)));
		setThumbnail(defaultTattoo.thumbnail);
		setMediaMap(stageMapMedia(defaultTattoo.stages));
		setHasStageChange(false);
	};

	const hasTattooChange = () => {
		return (
			defaultTattoo.styleId !== tattoo.styleId ||
			defaultTattoo.size !== tattoo.size ||
			defaultTattoo.placement !== tattoo.placement ||
			defaultTattoo.thumbnail !== thumbnail ||
			defaultTattoo.isPublicized !== tattoo.isPublicized
		);
	};

	const handleCreateTattoo = () => {
		const newTattoo = {
			artistId: tattoo.artist.id,
			styleId: tattoo.styleId,
			size: tattoo.size,
			placement: tattoo.placement,
			thumbnail: thumbnail,
			isPublicized: tattoo.isPublicized
		};
		console.log(tattooStyleById(tattoo.styleId), tattoo.styleId)
		fetcherPost(`${BASE_URL}/TattooArts/CreateTattoo`, newTattoo)
			.then((data) => {
				tattoo.id = data.id;
				handleCreateUpdateStage()
			})
			.catch((e) => {
				handleAlert(true, 'Tạo hình xăm thất bại', '', true);
			});
	};

	const handleUpdateTattoo = () => {
		if (hasTattooChange()) {
			const newTattoo = {
				id: tattoo.id,
				styleId: tattoo.styleId,
				size: tattoo.size,
				placement: tattoo.placement,
				thumbnail: thumbnail,
				isPublicized: tattoo.isPublicized
			};
			fetcherPut(`${BASE_URL}/TattooArts/UpdateTattoo`, newTattoo)
				.then(() => {
					if (!hasStageChange) {
						handleAlert(true, 'Cập nhật hình xăm thành công');
					}
				})
				.catch((e) => {
					handleAlert(true, 'Cập nhật hình xăm thất bại', '', true);
				});
		}
	};

	const handleCreateUpdateStage = () => {
		if (hasStageChange) {
			const stages = JSON.parse(JSON.stringify(tattoo.stages));
			stages.forEach((stage) => {
				stage.medias = mediaMap.get(stage.id).map((media) => {
					return {
						id: media.id,
						url: media.url,
						isPublicized: media.isPublicized
					};
				});
				stage.id = v4();
			});
			fetcherPut(
				`${BASE_URL}/TattooArts/UpdateCreateTattooStage?artId=${tattoo.id}`,
				stages
			).then(() => {
				handleSubmit(tattoo.id);
			});
		}
	};

	const handleSaveChange = () => {
		if (tattoo.id === '') {
			handleAlert(true, 'Đang tạo hình xăm...');
			handleCreateTattoo();
		} else if (hasTattooChange() || hasStageChange) {
			handleAlert(true, 'Đang cập nhật hình xăm...');
			handleUpdateTattoo();
			handleCreateUpdateStage();
		}
	};

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
			<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56">
				<Card>
					<CardBody>
						<div className="flex justify-between border-b border-gray-300 pb-3">
							<Link href={bookingId !== '' ? `/booking/${bookingId}` : '/myTattoo'}>
								<div className="cursor-pointer flex gap-1 text-gray-500 hover:text-indigo-500">
									<ChevronLeft width={20} heigh={20} /> TRỞ LẠI
								</div>
							</Link>
							<div className="flex items-center cursor-pointer gap-2">
								<div className="text-gray-500">Public:</div>
								<div
									onClick={() =>
										setTattooState('isPublicized', !tattoo.isPublicized)
									}
									className="relative"
								>
									<input
										checked={tattoo.isPublicized}
										type="checkbox"
										readOnly
										className="hidden"
										disabled={false}
									/>
									<div className="toggle__bar h-4 bg-gray-400 rounded-full shadow-inner"></div>
									<div className="toggle__handle absolute bg-white rounded-full shadow-sm transform transition duration-150 ease-in-out"></div>
								</div>
							</div>
						</div>
						{
							// Tattoo info
						}
						<div className="py-3 border-b border-gray-300 flex gap-5 flex-wrap">
							<div className="w-full min-w-min sm:w-1/2 md:w-1/3 lg:w-1/4">
								<div className="flex justify-center">
									<div key={thumbnail}>
										<Avatar
											circular={false}
											src={thumbnail ? thumbnail : '/images/upload-img.png'}
											alt={'Thumbnail'}
											size={150}
										/>
									</div>
								</div>
								<div className="flex flex-wrap items-center mt-1">
									<div className="mx-auto">
										<CldButton
											onSuccess={(result, options) => setThumbnail(result.info?.url)}
										>
											<div className="flex gap-1 items-center">
												<MdUpload size={16} />
												<div>Thay thumbnail</div>
											</div>
										</CldButton>
									</div>
								</div>
							</div>
							<div className="">
								<div className="font-semibold text-lg pb-2">Thông tin hình xăm</div>
								<div className="pb-3 flex items-center gap-1">
									<div className="w-20">Nghệ sĩ xăm:</div>
									<span className="font-semibold">
										{tattoo.artist.fullName}
									</span>
								</div>
								<div className="pb-3 flex items-center gap-1">
									<div className="w-20">Kích thước: </div>
									<Dropdown className="relative h-full flex items-center">
										<DropdownToggle>
											<div className="relative">
												<div className="w-32 rounded-lg p-1 border border-gray-300">
													{stringSize.at(tattoo.size)}
												</div>

												<div className="absolute top-1.5 right-2 text-gray-700">
													<ChevronDown width={17} height={17} />
												</div>
											</div>
										</DropdownToggle>
										<DropdownMenu>
											{stringSize.map((size, sizeIndex) => (
												<div
													key={size}
													onClick={() => setTattooState('size', sizeIndex)}
													className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
														tattoo.size === sizeIndex ? 'bg-indigo-100' : ''
													}`}
												>
													{size}
												</div>
											))}
										</DropdownMenu>
									</Dropdown>
								</div>
								<div className="pb-3 flex gap-1 items-center">
									<div className="w-20">Vị trí xăm:</div>
									<Dropdown className="relative h-full flex items-center">
										<DropdownToggle>
											<div>
												<div className="w-32 rounded-lg p-1 border border-gray-300">
													{stringPlacements.at(tattoo.placement)}
												</div>

												<div className="absolute top-1.5 right-2 text-gray-700">
													<ChevronDown width={17} height={17} />
												</div>
											</div>
										</DropdownToggle>
										<DropdownMenu className={'top-2 left-2'}>
											<div className="h-40 overflow-y-auto">
												{stringPlacements.map((placement, placementIndex) => (
													<div
														key={placement}
														onClick={() =>
															setTattooState('placement', placementIndex)
														}
														className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
															tattoo.placement === placementIndex
																? 'bg-indigo-100'
																: ''
														}`}
													>
														{placement}
													</div>
												))}
											</div>
										</DropdownMenu>
									</Dropdown>
								</div>
								<div className="pb-3 flex gap-1 items-center">
									<div className="w-20">Style:</div>
									<Dropdown className="relative h-full flex items-center">
										<DropdownToggle>
											<div className="relative">
												<div className="w-32 md:w-48 rounded-lg p-1 border border-gray-300">
													{tattooStyleById(tattoo.styleId)?.name}
												</div>

												<div className="absolute top-1.5 right-2 text-gray-700">
													<ChevronDown width={17} height={17} />
												</div>
											</div>
										</DropdownToggle>
										<DropdownMenu closeOnClick={true} className={'top-2 left-2'}>
											<div className="h-40 overflow-y-auto">
												{tattooStyleList.map((style, styleIndex) => (
													<div
														key={style.id}
														onClick={() => setTattooState('styleId', style.id)}
														className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
															tattoo.styleId === style.id ? 'bg-indigo-100' : ''
														}`}
													>
														{style.name}
													</div>
												))}
											</div>
										</DropdownMenu>
									</Dropdown>
								</div>
								{/* <div className="pb-3 flex gap-1 items-center">
									<div className="w-20">Giá:</div>
									<div className="w-48">
										<MoneyInput
											value={tattoo.price}
											disabled={bookingId !== ''}
											onAccept={(value, mask) => setTattooState('price', value)}
										/>
									</div>
								</div> */}
							</div>
						</div>
						{tattoo.bookingId !== '' && (
							<div className="mt-3 border-b border-gray-300">
								{
									// Booking details list
								}
								<div className="font-semibold text-lg pb-2">
									Ghi nhận chi phí dịch vụ
								</div>

								{tattoo.bookingDetails.map((detail, detailIndex) => (
									<div
										className={
											'relative min-w-0 break-words rounded-lg mb-4 w-full bg-white dark:bg-gray-600'
										}
										key={detail.bookingDetailsId}
									>
										<div className={'py-1 px-6 flex flex-row items-center'}>
											<div className="relative flex flex-wrap justify-between items-center w-full">
												<div>{operationNames.at(detail.operationId)}</div>

												<div className="text-base relative">
													{formatPrice(detail.price)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
						{
							// Update tattoo stages and booking details
						}
						<div>
							{
								// Add tattoo stage, including tattoo medias
							}
							<div>
								<div className="flex pt-3">
									<div>
										<Button onClick={handleAddStage}>Thêm giai đoạn</Button>
									</div>
								</div>
								{tattoo.stages.map((stage, stageIndex) => (
									<Card className={'pt-3'} key={stage.id}>
										<CardBody className={'shadow-md bg-gray-50 relative'}>
											<div className="w-full relative">
												{
													// Remove stage icon
												}
												<div className="w-full pb-3 flex justify-end">
													<button
														className={`hover:scale-125 hover:text-red-500`}
														onClick={() => handleRemoveStage(stageIndex)}
													>
														<AiOutlineClose size={16} />
													</button>
												</div>
												{
													//Stage body
												}
												<div key={stage.id}>
													<div className="flex gap-2 flex-wrap items-center">
														<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Chọn giai đoạn
														</label>
														<Dropdown className={'relative'}>
															<DropdownToggle>
																<div className="relative">
																	<div className="w-40 rounded-lg p-2 text-base border border-gray-300">
																		{stringTattooStages.at(stage.stageStyle)}
																	</div>
																	<div className="absolute top-3.5 right-2 text-gray-700">
																		<ChevronDown width={17} height={17} />
																	</div>
																</div>
															</DropdownToggle>
															<DropdownMenu>
																{stringTattooStages.map(
																	(stageStyle, stageStyleIndex) => (
																		<div
																			key={stageStyleIndex}
																			onClick={() =>
																				handleStageChange(
																					{
																						target: {
																							name: 'stageStyle',
																							value: stageStyleIndex
																						}
																					},
																					stageIndex
																				)
																			}
																			className={`px-2 py-1 w-40 cursor-pointer hover:bg-gray-100`}
																		>
																			{stageStyle}
																		</div>
																	)
																)}
															</DropdownMenu>
														</Dropdown>
													</div>
													<div>
														<label className="pt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Thêm mô tả
														</label>
														<textarea
															className="w-full rounded-lg p-2 text-base border border-gray-300"
															type="text"
															rows={5}
															value={stage.description}
															name="description"
															onChange={(e) => handleStageChange(e, stageIndex)}
															placeholder="Mô tả cho hình xăm"
														/>
													</div>
													{
														// Add media section
													}
													<div>
														<label className="pt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Thêm ảnh/video cho hình xăm
														</label>
														<div className="flex">
															<div>
																<CldUploadButton
																	onSuccess={(result, options) =>
																		handleUploadImage(result, options, stageIndex)
																	}
																	uploadPreset={UPLOAD_PRESET}
																	className="text-gray-800 bg-white ring-1 ring-gray-300 hover:text-white hover:bg-gray-700 font-medium rounded-lg text-sm py-2 px-2 w-full"
																>
																	<div className="flex gap-1 items-center">
																		<MdUpload size={16} />
																		<div>Upload</div>
																	</div>
																</CldUploadButton>
															</div>
														</div>
														<p
															className="mt-1 mb-5 text-sm text-gray-500 dark:text-gray-300"
															id="file_input_help"
														>
															PNG, JPG hoặc GIF.
														</p>
													</div>
													{
														//Show media section
													}
													<div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
														{mediaMap.get(stage.id).map((media, mediaIndex) => (
															<div className="relative" key={media.id}>
																<div className="absolute top-0 left-0 flex items-center cursor-pointer gap-2">
																	<div className="text-gray-500">Public:</div>
																	<div
																		onClick={() =>
																			handlePublicImage(stageIndex, mediaIndex)
																		}
																		className="relative"
																	>
																		<input
																			checked={media.isPublicized}
																			type="checkbox"
																			readOnly
																			className="hidden"
																			disabled={false}
																		/>
																		<div className="toggle__bar h-4 bg-gray-400 rounded-full shadow-inner"></div>
																		<div className="toggle__handle absolute bg-white rounded-full shadow-sm transform transition duration-150 ease-in-out"></div>
																	</div>
																</div>
																<button
																	onClick={() =>
																		handleDeleteCloudinaryImage(
																			media.url,
																			stageIndex,
																			mediaIndex
																		)
																	}
																>
																	<AiOutlineClose
																		className="absolute top-0 right-0 hover:scale-125 hover:text-red-500"
																		size={16}
																	/>
																</button>
																<BackgroundImg
																	key={media.id}
																	className="relative w-full bg-center bg-cover bg-fallback mt-1"
																	image={media.url}
																	height={150}
																/>
															</div>
														))}
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
								))}
							</div>
						</div>
						{
							// Save or reset tattoo
						}
						<div className="flex justify-end flex-wrap gap-2">
							<div className="w-16">
								<Button outline onClick={handleResetChange}>
									Reset
								</Button>
							</div>
							<div className="w-16">
								<Button onClick={handleSaveChange}>Lưu</Button>
							</div>
						</div>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

TattooDetailsPage.propTypes = {
	bookingId: PropTypes.string,
	artTattoo: PropTypes.object,
	handleSubmit: PropTypes.func.isRequired
};

export default TattooDetailsPage;
