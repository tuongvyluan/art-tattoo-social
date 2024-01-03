import { ChevronDown, ChevronLeft } from 'icons/solid';
import { MdUpload } from 'react-icons/md';
import {
	Alert,
	Card,
	CardBody,
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Link
} from 'ui';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import Button from 'components/Button';
import { fetcherPost, fetcherPut } from 'lib';
import { CldUploadButton } from 'next-cloudinary';
import { generateSHA1, generateSignature } from 'lib/cloudinary_signature';
import { AiOutlineClose } from 'react-icons/ai';
import { extractPublicId } from 'cloudinary-build-url';
import { SERVICE_PLACEMENT, TATTOO_ART_STATUS, stringPlacements, stringSize, stringTattooStages } from 'lib/status';
import { tattooStyleById, tattooStyleList } from 'lib/tattooStyle';
import { API_KEY, API_SECRET, BASE_URL, CLOUD_NAME, UPLOAD_PRESET } from 'lib/env';
import { v4 } from 'uuid';
import CldButton from 'components/CldButton';
import { noImageAvailable } from 'lib/tattooPhoto';
import Image from 'next/future/image';

const stageMapMedia = (stages) => {
	return new Map(
		stages.map((stage) => {
			return [stage.id, stage.tattooImages];
		})
	);
};

const deepCopyMap = (map) => {
	return new Map(JSON.parse(JSON.stringify(Array.from(map))));
};

function TattooDetailsPage({
	bookingId,
	artTattoo,
	handleSubmit,
	myTattoo = false
}) {
	const [defaultTattoo, setDefaultTattoo] = useState(
		JSON.parse(JSON.stringify(artTattoo))
	);
	const [tattoo, setTattoo] = useState(defaultTattoo);
	const [thumbnail, setThumbnail] = useState(defaultTattoo.thumbnail);
	const [mediaMap, setMediaMap] = useState(stageMapMedia(defaultTattoo.stages));
	const [hasStageChange, setHasStageChange] = useState(false);

	const mediaStateRef = useRef();
	mediaStateRef.current = mediaMap;
	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: 'blue'
	});

	const handleAlert = (state, title, content, isWarn = 0) => {
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
		const stages = tattoo.stages;
		const mediaMap = mediaStateRef.current;
		const tattooImages = mediaMap.get(stages.at(stageIndex).id);
		const image = tattooImages.at(mediaIndex);
		// If this image was recently added and its link hasn't been saved to db, completely remove it from cloudinary
		if (!image.saved) {
			deleteCloudinaryImage(imgUrl);
		}
		const newImages = tattooImages.toSpliced(mediaIndex, 1);
		mediaMap.set(stages.at(stageIndex).id, newImages);

		setMediaMap(deepCopyMap(mediaMap));
	};

	const handleUploadImage = (result, options, stageIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const stages = tattoo.stages;
		const mediaMap = mediaStateRef.current;
		const tattooImages = mediaMap.get(stages.at(stageIndex).id);
		tattooImages.push({
			id: v4(),
			url: result.info?.url,
			description: '',
			isPublicized: false,
			saved: false
		});

		mediaMap.set(stages.at(stageIndex).id, tattooImages);
		setMediaMap(deepCopyMap(mediaMap));
	};

	const handlePublicImage = (stageIndex, mediaIndex) => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const stages = tattoo.stages;
		const mediaMap = mediaStateRef.current;
		const tattooImages = mediaMap.get(stages.at(stageIndex).id);
		tattooImages[mediaIndex] = {
			...tattooImages[mediaIndex],
			isPublicized: !tattooImages[mediaIndex].isPublicized
		};
		mediaMap.set(stages.at(stageIndex).id, tattooImages);
		setMediaMap(deepCopyMap(mediaMap));
	};

	const handleAddStage = () => {
		if (!hasStageChange) {
			setHasStageChange(true);
		}
		const stages = tattoo.stages;
		const newId = v4();
		stages.push({
			id: newId,
			stageStyle: 0,
			description: '',
			tattooImages: []
		});
		mediaMap.set(newId, []);
		setTattoo({ ...tattoo, stages: stages });
		setMediaMap(deepCopyMap(mediaMap));
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
		if (key === 'isPublicized' && thumbnail === '' && !tattoo.isPublicized) {
			handleAlert(
				true,
				'Public hình xăm không thành công.',
				'Hình xăm phải có ảnh thumbnail mới được public.',
				2
			);
		} else if (key === 'status' && thumbnail === '' && !tattoo.status) {
			handleAlert(
				true,
				'Cập nhật trạng thái không thành công.',
				'Hình xăm phải có ảnh thumbnail mới được hoàn thành.',
				2
			);
		} else if (tattoo[key] !== newValue) {
			setTattoo({ ...tattoo, [key]: newValue });
		}
	};

	const handleResetChange = () => {
		const stages = tattoo.stages;
		const stageLength = stages.length;
		let i = 0;
		let j;
		let tattooImages;
		for (i; i < stageLength; i++) {
			tattooImages = stages.at(i).tattooImages;
			for (j = 0; j < tattooImages.length; j++) {
				if (!tattooImages.at(j).saved) {
					deleteCloudinaryImage(tattooImages.at(j).url);
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
			defaultTattoo.isPublicized !== tattoo.isPublicized ||
			defaultTattoo.status !== tattoo.status
		);
	};

	const handleCreateTattoo = () => {
		const newTattoo = {
			artistId: tattoo.artist.id,
			styleId: tattoo.styleId,
			size: tattoo.size,
			placement: tattoo.placement,
			thumbnail: thumbnail,
			isPublicized: tattoo.isPublicized && thumbnail !== ''
		};
		fetcherPost(`${BASE_URL}/TattooArts/CreateTattoo`, newTattoo)
			.then((data) => {
				tattoo.id = data.id;
				handleCreateUpdateStage();
			})
			.catch((e) => {
				handleAlert(true, 'Tạo hình xăm thất bại', '', 2);
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
				isPublicized: tattoo.isPublicized && thumbnail !== '',
				status: tattoo.status ? TATTOO_ART_STATUS.COMPLETED : TATTOO_ART_STATUS.PENDING
			};
			fetcherPut(`${BASE_URL}/TattooArts/UpdateTattoo`, newTattoo)
				.then(() => {
					if (!hasStageChange) {
						handleAlert(true, 'Cập nhật hình xăm thành công', '', 1);
					}
				})
				.catch((e) => {
					handleAlert(true, 'Cập nhật hình xăm thất bại', '', 2);
				});
		}
	};

	const handleCreateUpdateStage = () => {
		if (hasStageChange) {
			const stages = JSON.parse(JSON.stringify(tattoo.stages));
			stages.forEach((stage) => {
				stage.medias = mediaMap.get(stage.id)?.map((media) => {
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
		<div className="relative min-h-body">
			<Alert
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				color={alertContent.isWarn}
				className="bottom-2 right-2 fixed max-w-md z-50"
			>
				<strong className="font-bold mr-1">{alertContent.title}</strong>
				<span className="block sm:inline">{alertContent.content}</span>
			</Alert>
			<div className="sm:px-12 md:px-16 lg:px-32 xl:px-56">
				<Card>
					<CardBody>
						<div className="flex justify-between border-b border-gray-300 pb-3">
							<Link prefetch={false}
								href={
									bookingId === 'null' || myTattoo || bookingId === ''
										? '/myTattoo'
										: `/booking/${bookingId}`
								}
							>
								<div className="cursor-pointer flex gap-1 text-gray-500 hover:text-indigo-500">
									<ChevronLeft width={20} heigh={20} /> TRỞ LẠI
								</div>
							</Link>
							<div className="flex items-center cursor-pointer gap-2">
								<div className="text-gray-500">Public:</div>
								<div
									role="button"
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
									<div className="w-36 pb-3" key={thumbnail}>
										<Image
											width={0}
											height={0}
											sizes="100vw"
											priority
											src={thumbnail?.length > 0 ? thumbnail : noImageAvailable}
											alt={'a'}
											className="relative w-full h-auto rounded-lg"
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
									<span className="font-semibold">{tattoo.artist.fullName}</span>
								</div>
								<div className="pb-3 flex items-center gap-1">
									<div className="w-20">Kích thước: </div>
									{bookingId !== 'null' ? (
										<div>{stringSize.at(tattoo.size)}</div>
									) : (
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
														role="button"
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
									)}
								</div>
								<div className="pb-3 flex gap-1 items-center">
									<div className="w-20">Vị trí xăm:</div>
									{tattoo.servicePlacement !== SERVICE_PLACEMENT.ANY ? (
										<div className="">{stringPlacements.at(tattoo.placement)}</div>
									) : (
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
															role="button"
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
									)}
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
											<div className="h-32 overflow-y-auto">
												{tattooStyleList.map((style, styleIndex) => (
													<div
														role="button"
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
						{
							// Update tattoo stages and booking details
						}
						<div>
							{
								// Add tattoo stage, including tattoo tattooImages
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
													<div role='button'
														className={`hover:scale-125 hover:text-red-500`}
														onClick={() => handleRemoveStage(stageIndex)}
													>
														<AiOutlineClose size={16} />
													</div>
												</div>
												{
													//Stage body
												}
												<div key={stage.id}>
													<div className="flex gap-2 flex-wrap items-center">
														<div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Chọn giai đoạn
														</div>
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
																			role="button"
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
														<div className="pt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Thêm mô tả
														</div>
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
														<div className="pt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
															Thêm ảnh cho hình xăm
														</div>
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
														{mediaMap.get(stage.id)?.map((media, mediaIndex) => (
															<div className="relative" key={media.id}>
																<div className="absolute top-0 left-0 flex items-center cursor-pointer gap-2">
																	<div className="text-gray-500">Public:</div>
																	<div
																		role="button"
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
																<div role='button'
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
																</div>
																<Image
																	width={0}
																	height={0}
																	sizes="100vw"
																	key={media.id}
																	priority
																	src={media.url}
																	alt={'a'}
																	className="relative w-full h-auto rounded-lg"
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
						<div className="flex justify-between flex-wrap gap-2 pt-3">
							<div className="flex items-center cursor-pointer gap-2">
								<div className="font-semibold">Đã hoàn thành:</div>
								<div
									role="button"
									onClick={() => setTattooState('status', !tattoo.status)}
									className="relative"
								>
									<input
										checked={tattoo.status}
										type="checkbox"
										readOnly
										className="hidden"
										disabled={false}
									/>
									<div className="toggle__bar h-4 bg-gray-400 rounded-full shadow-inner"></div>
									<div className="toggle__handle absolute bg-white rounded-full shadow-sm transform transition duration-150 ease-in-out"></div>
								</div>
							</div>
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
	handleSubmit: PropTypes.func.isRequired,
	myTattoo: PropTypes.bool
};

export default TattooDetailsPage;
