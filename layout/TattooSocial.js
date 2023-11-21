import { ChevronLeft } from 'icons/solid';
import { IoMdHeartEmpty, IoMdHeart, IoIosLink, IoMdSend } from 'react-icons/io';
import { HiDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Avatar, Dropdown, DropdownMenu, DropdownToggle, Loading } from 'ui';
import { TattooArtCarousel } from 'ui/TattooArtCarousel';
import Button from 'components/Button';
import { stringSize } from 'lib/status';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import { fetcherDelete, fetcherPost, fetcherPut } from 'lib';
import { BASE_URL } from 'lib/env';
import MyModal from 'components/MyModal';
import { stringReports } from 'lib/reportType';
import Router from 'next/router';
import { Tooltip } from 'flowbite-react';

const TattooSocial = ({ tattoo, medias, artist, likes, comments }) => {
	const { status, data } = useSession();
	const [countLike, setCountLike] = useState(likes.length);
	const [myLike, setMyLike] = useState(false);
	const images = medias.map((media) => media.url);
	const [commentList, setCommentList] = useState(comments);
	const [myComment, setMyComment] = useState('');
	const [authen, setAuthen] = useState(false);
	const [reportModal, setReportModal] = useState(false);
	const [deleteCmtModal, setDeleteCmtModal] = useState(false);
	const [myReportContent, setMyReportContent] = useState('');
	const [myReportType, setMyReportType] = useState(0);
	const [reportedCommentId, setReportedCommentId] = useState(null);
	const [deletedCommentId, setDeletedCommentId] = useState('');
	const [hidePostModal, setHidePostModal] = useState(false);
	const [shareTooltipContent, setShareTooltipContent] =
		useState('Copy link bài viết');

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	if (status === 'authenticated') {
		if (!authen) {
			setAuthen(true);
		}
		if (
			!myLike &&
			likes.filter((like) => like.accountId === data.user.id).length > 0
		) {
			setMyLike(true);
		}
	}

	if (status === 'unauthenticated') {
		function remindLogin() {
			window.open('/auth/signin', 'blank');
		}
		const elements = document.getElementsByClassName('myInteraction');
		Array.from(elements).forEach(function (element) {
			element.addEventListener('click', remindLogin);
		});
	}

	const handleSetComment = (e) => {
		setMyComment(e.target.value);
	};

	const onKeyDown = (e) => {
		handleKeyDown(e);
	};

	const handleKeyDown = debounce((e) => {
		if (e.keyCode === 13 || e.key === 'Enter') {
			sendCommend();
		}
	}, 300);

	const sendCommend = () => {
		if (authen && myComment.trim().length > 0) {
			fetcherPost(`${BASE_URL}/Media/CreateComment`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id,
				content: myComment
			}).then((response) => {
				const newCommentList = [
					{
						id: response.id,
						accountId: data.user.id,
						content: myComment
					}
				].concat(commentList);
				setCommentList(newCommentList);
			});

			setMyComment('');
		}
	};

	const handleSetLike = () => {
		if (!myLike) {
			fetcherPost(`${BASE_URL}/Media/CreateLike`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id
			});
			setCountLike(countLike + 1);
		} else {
			fetcherDelete(
				`${BASE_URL}/Media/DeleteLikeById?userId=${data.user.id}&artTattooId=${tattoo.id}`
			);
			setCountLike(countLike - 1);
		}
		setMyLike(!myLike);
	};

	const handleSetReportContent = (e) => {
		setMyReportContent(e.target.value);
	};

	const handleOpenReportModal = (commentId) => {
		setReportedCommentId(commentId);
		setReportModal(true);
	};

	const handleOpenDeleteCommentModal = (commentId) => {
		setDeletedCommentId(commentId);
		setDeleteCmtModal(true);
	};

	const handleSubmitReport = () => {
		fetcherPost(`${BASE_URL}/Media/CreateReport`, {
			reporter: data.user.id,
			tattooArtId: tattoo.id,
			commentId: reportedCommentId,
			content: myReportContent,
			status: 0,
			reportType: myReportType
		}).catch((e) => console.log(e));
		if (reportedCommentId) {
			setCommentList(commentList.filter((cmt) => cmt.id !== reportedCommentId));
			setReportedCommentId(null);
		}
		setMyReportType(0);
		setMyReportContent('');
		setReportModal(false);
	};

	const handleSubmitDelete = () => {
		fetcherDelete(
			`${BASE_URL}/Media/DeleteCommentById?id=${deletedCommentId}`
		).catch((e) => console.log(e));
		setCommentList(commentList.filter((cmt) => cmt.id !== deletedCommentId));
		setDeletedCommentId(null);
		setDeleteCmtModal(false);
	};

	const handleOpenHideTattooModal = () => {
		setHidePostModal(true);
	};

	const handleHideTattoo = () => {
		fetcherPut(`${BASE_URL}/TattooArts/UpdateTattoo`, {
			id: tattoo.id,
			isPublicized: false
		}).catch((e) => console.log(e));
		Router.replace('/');
	};

	const handleCopyLink = () => {
		setShareTooltipContent('Copy link thành công');
		navigator.clipboard.writeText(window.location.href);
	};

	return (
		<div className="relative">
			<Link href={'/tattoo'}>
				<ChevronLeft
					width={30}
					height={30}
					className="absolute cursor-pointer left-5 top-3 z-20"
				/>
			</Link>
			<div className="w-full max-w-xl lg:max-w-4xl xl:max-w-6xl mx-auto">
				<div className="relative min-w-0 break-words rounded-lg overflow-hidden shadow-sm w-full bg-white dark:bg-gray-600">
					<div className="block lg:flex md:items-start">
						{
							// Tattoo image
						}
						<div className="w-full lg:w-2/3">
							<TattooArtCarousel imageHeight={600} images={images} />
						</div>
						<div className="w-full lg:w-1/3 pt-3 pb-3 h-152 overflow-auto">
							{
								// Artist info
							}
							<div className="flex justify-between px-5">
								<div className="flex gap-3 items-center pb-2">
									<div className="cursor-pointer">
										<Avatar
											size={40}
											src={artist.avatar ? artist.avatar : ''}
											alt={artist.firstName}
										/>
									</div>
									<div className="cursor-pointer">
										<div className="font-semibold">
											{artist.firstName} {artist.lastName}
										</div>
										<div className="text-gray-700">200 người theo dõi</div>
									</div>
								</div>
								<div>
									<Button>Đặt hẹn</Button>
								</div>
							</div>
							{
								// Tattoo info
							}
							<div className="px-5 py-3 border-b-2 border-t-2 border-gray-200">
								<div className="flex justify-between">
									<div className="flex gap-2 pb-3">
										<div className="px-2 bg-gray-700 text-white rounded-2xl shadow-2xl cursor-pointer">
											{tattoo.style.name}
										</div>
										<div className="px-2 bg-gray-700 text-white rounded-2xl shadow-2xl cursor-pointer">
											{stringSize.at(tattoo.size)}
										</div>
									</div>
									{authen && (
										<div className="pt-1">
											<Dropdown className={'relative'}>
												<DropdownToggle>
													<div>
														<HiDotsVertical size={12} className="text-gray-500" />
													</div>
												</DropdownToggle>
												<DropdownMenu className={'top-2 left-2'}>
													{tattoo.artistId === data.user.id ? (
														<div
															onClick={handleOpenHideTattooModal}
															className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 font-semibold"
														>
															Ẩn bài đăng
														</div>
													) : (
														<div
															onClick={() => handleOpenReportModal(undefined)}
															className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 font-semibold"
														>
															Báo cáo bài đăng
														</div>
													)}
												</DropdownMenu>
											</Dropdown>
										</div>
									)}
								</div>
								<div className="pb-3">{tattoo.description}</div>
								<div className="flex items-start gap-1">
									<div className="flex gap-1 items-center">
										{authen ? (
											<div onClick={handleSetLike}>
												{myLike ? (
													<IoMdHeart
														className="text-red-500 hover:text-red-600 font-semibold cursor-pointer"
														size={20}
													/>
												) : (
													<IoMdHeartEmpty
														className="hover:text-gray-600 font-semibold cursor-pointer"
														size={20}
													/>
												)}
											</div>
										) : (
											<div className="myInteraction">
												{myLike ? (
													<IoMdHeart
														className="hover:text-gray-600 font-semibold cursor-pointer"
														size={20}
													/>
												) : (
													<IoMdHeartEmpty
														className="hover:text-gray-600 font-semibold cursor-pointer"
														size={20}
													/>
												)}
											</div>
										)}
										<div className="flex gap-1 items-end text-gray-700">
											<div className="text-left text-xs font-semibold w-14">
												{countLike} Thích
											</div>
										</div>
									</div>
									<Tooltip
										onMouseLeave={() => setShareTooltipContent('Copy link bài viết')}
										content={shareTooltipContent}
										placement="bottom"
									>
										<div
											onClick={handleCopyLink}
											className="flex gap-1 items-center cursor-pointer"
										>
											<div>
												<IoIosLink
													className="hover:text-gray-600 cursor-pointer"
													size={20}
												/>
											</div>
											<div className="text-left text-xs font-semibold w-14">
												Chia sẻ
											</div>
										</div>
									</Tooltip>
								</div>
							</div>
							{
								// Comment section
							}
							<div className="px-5 pt-3">
								<div className="text-base font-semibold">Bình luận</div>
								<div className="pt-1">
									<div className="relative flex gap-2">
										<textarea
											aria-label={'Comment'}
											name="comment"
											type="text"
											rows={2}
											value={myComment}
											onChange={handleSetComment}
											onKeyDown={onKeyDown}
											className="myInteraction appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
											placeholder={'Thêm bình luận'}
										/>
										<button onClick={sendCommend}>
											<IoMdSend
												className="hover:text-gray-600 cursor-pointer"
												size={20}
											/>
										</button>
									</div>
									{commentList.map((cmt, cmtIndex) => (
										<div
											key={cmt.id}
											className="py-2 flex justify-between gap-2 items-start"
										>
											<div className="flex gap-1 items-center">
												<Avatar size={30} src={''} alt={cmt.id} />
												<div>
													<span className="font-semibold pr-1">Trân Nguyễn</span>
													{cmt.content}
												</div>
											</div>
											{authen && (
												<div className="pt-1">
													<Dropdown className={'relative'}>
														<DropdownToggle>
															<div>
																<HiDotsVertical
																	size={12}
																	className="text-gray-500"
																/>
															</div>
														</DropdownToggle>
														<DropdownMenu className={'top-2 left-2'}>
															{cmt.accountId === data.user.id ? (
																<div
																	onClick={() =>
																		handleOpenDeleteCommentModal(cmt.id)
																	}
																	className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 font-semibold"
																>
																	Xoá bình luận
																</div>
															) : (
																<div
																	onClick={() => handleOpenReportModal(cmt.id)}
																	className="px-2 py-1.5 cursor-pointer hover:bg-gray-100 font-semibold"
																>
																	Báo cáo bình luận
																</div>
															)}
														</DropdownMenu>
													</Dropdown>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{
				// Modal warning when remove comment
			}
			<MyModal
				openModal={deleteCmtModal}
				setOpenModal={setDeleteCmtModal}
				warn={true}
				title="Xoá bình luận"
				onSubmit={handleSubmitDelete}
			>
				<div>Bạn có chắc sẽ xoá bình luận này chứ?</div>
			</MyModal>
			{
				// Modal warning when hide tattoo art
			}
			<MyModal
				openModal={hidePostModal}
				setOpenModal={setHidePostModal}
				warn={true}
				title="Ẩn bài đăng"
				onSubmit={handleHideTattoo}
			>
				<div>Bạn có chắc sẽ ẩn bài đăng này chứ?</div>
			</MyModal>
			{
				// Modal warning when report
			}
			<MyModal
				title="Báo cáo nội dung"
				openModal={reportModal}
				setOpenModal={setReportModal}
				onSubmit={handleSubmitReport}
			>
				<div>
					<ul className="h-72 pb-6 overflow-y-auto">
						{stringReports.map((reportType, index) => (
							<li
								className="my-1 full px-3 flex items-center gap-2 cursor-pointer"
								onClick={() => setMyReportType(index)}
								key={index}
							>
								<input
									type="radio"
									value={index}
									onChange={() => setMyReportType(index)}
									checked={index === myReportType}
								/>
								<div>{reportType}</div>
							</li>
						))}
					</ul>
					<label className="text-sm font-semibold">Giải thích thêm (nếu muốn)</label>
					<textarea
						rows={4}
						type="text"
						value={myReportContent}
						onChange={handleSetReportContent}
						className="appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
					/>
				</div>
			</MyModal>
		</div>
	);
};

TattooSocial.propTypes = {
	tattoo: PropTypes.object.isRequired,
	medias: PropTypes.array.isRequired,
	likes: PropTypes.array.isRequired,
	comments: PropTypes.array.isRequired,
	artist: PropTypes.object.isRequired
};

export default TattooSocial;
