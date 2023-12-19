import { ChevronLeft } from 'icons/solid';
import { IoMdHeartEmpty, IoMdHeart, IoIosLink, IoMdSend } from 'react-icons/io';
import { HiDotsVertical } from 'react-icons/hi';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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
import StylePill from 'components/StylePill';

const TattooSocial = ({ tattoo, tattooImages, artist, likes, comments }) => {
	const { status, data } = useSession();
	const [countLike, setCountLike] = useState(likes.length);
	const [likeList, setLikeList] = useState(likes);
	const images = tattooImages.map((media) => media.url);
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

	useEffect(() => {
		setLikeList(likes);
		setCountLike(likes.length);
	}, [likes]);

	useEffect(() => {
		setCommentList(comments);
	}, [comments]);

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
			})
				.then((response) => {
					const newCommentList = [
						{
							id: response.id,
							accountId: data.user.id,
							avatar: data.user.avatar,
							fullName: data.user.fullName,
							content: myComment
						}
					].concat(commentList);
					setCommentList(newCommentList);
				})
				.catch((e) => console.log(e));

			setMyComment('');
		}
	};

	const handleSetLike = debounce(() => {
		handleCallLikeApi();
	}, 200);

	const handleCallLikeApi = () => {
		if (likeList.filter((like) => like.accountId === data.user.id).length > 0) {
			fetcherDelete(
				`${BASE_URL}/Media/DeleteLikeById?userId=${data.user.id}&artTattooId=${tattoo.id}`
			).catch((e) => console.log(e));
			setLikeList(likeList.filter((like) => like.accountId !== data.user.id));
			setCountLike(countLike - 1);
		} else {
			fetcherPost(`${BASE_URL}/Media/CreateLike`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id
			}).catch((e) => console.log(e));
			likeList.push({ accountId: data.user.id });
			setCountLike(countLike + 1);
		}
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
		<div className="relative pb-5">
			<Link href={'/tattoo'}>
				<ChevronLeft
					width={30}
					height={30}
					className="absolute cursor-pointer left-2 top-3 z-20"
				/>
			</Link>
			<div className="w-full max-w-max mx-auto">
				<div className="relative min-w-0 break-words rounded-lg overflow-hidden shadow-sm w-full bg-white dark:bg-gray-600">
					<div className="block lg:flex w-full md:items-start">
						{
							// Tattoo image
						}
						<div className="w-max flex-grow">
							<TattooArtCarousel imageHeight={600} images={images} />
						</div>
						<div className="w-full lg:w-96 pt-3 pb-3 h-full max-h-152 overflow-y-auto overflow-x-hidden">
							{
								// Artist info
							}
							<div className="flex justify-between flex-wrap px-5">
								<div className="flex gap-3 items-center pb-2">
									<Link href={`/artist/${artist.id}`}>
										<div className="cursor-pointer">
											<Avatar
												size={40}
												src={artist.avatar ? artist.avatar : '/images/avatar.png'}
												alt={artist.fullName}
											/>
										</div>
									</Link>
									<div>
										<Link href={`/artist/${artist.id}`}>
											<div className="cursor-pointer">
												<div className="font-semibold">{artist.fullName}</div>
											</div>
										</Link>
										{artist.workAt.id && (
											<div className="flex flex-wrap gap-1">
												<span>Làm việc tại: </span>
												<Link href={`/studio/${artist.workAt.id}`}>
													<div>
														<div className="font-semibold cursor-pointer">
															{artist.workAt.name}
														</div>
														<div>({artist.workAt.city})</div>
													</div>
												</Link>
											</div>
										)}
									</div>
								</div>
								{artist.workAt?.id && data?.user?.customerId && (
									<div className="pb-3">
										<a
											target="_blank"
											href={`/booking/new?studio=${artist.workAt.id}`}
										>
											<Button>Đặt hẹn</Button>
										</a>
									</div>
								)}
							</div>
							{
								// Tattoo info
							}
							<div className="px-5 py-3 border-b-2 border-t-2 border-gray-200">
								<div className="flex justify-between">
									<div className="flex flex-wrap gap-2 pb-3">
										<StylePill>{tattoo.style.name}</StylePill>
										<StylePill>{stringSize.at(tattoo.size)}</StylePill>
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
								{tattoo.doneAt.id && (
									<Link href={`/studio/${tattoo.doneAt.id}`}>
										<div className="pb-3">
											<div className="font-semibold text-gray-500 pb-1">
												Thực hiện ở:
											</div>
											<div className="p-3 hover:bg-gray-100 cursor-pointer flex flex-wrap items-center w-max gap-2">
												<div>
													<Avatar
														size={30}
														src={
															tattoo.doneAt.avatar
																? tattoo.doneAt.avatar
																: '/images/ATL.png'
														}
													/>
												</div>
												<div>
													<div className="font-semibold">{tattoo.doneAt.name}</div>
													<div>Ở {tattoo.doneAt.city}</div>
												</div>
												
											</div>
										</div>
									</Link>
								)}
								<div className="flex items-start gap-1">
									<div className="flex gap-1 items-center">
										{authen ? (
											<div key={countLike} onClick={handleSetLike}>
												{likeList.filter((like) => like.accountId === data.user.id)
													.length > 0 ? (
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
											<Tooltip
												arrow={false}
												content="Đăng nhập để thích bài viết"
												placement="bottom"
											>
												<div className="myInteraction">
													<IoMdHeartEmpty
														className="hover:text-gray-600 font-semibold cursor-pointer"
														size={20}
													/>
												</div>
											</Tooltip>
										)}
										<div className="flex gap-1 items-end text-gray-700">
											<div className="text-left text-xs font-semibold w-14">
												{countLike} Thích
											</div>
										</div>
									</div>
									<Tooltip
										arrow={false}
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
									<Tooltip
										arrow={false}
										trigger={authen ? '' : 'hover'}
										placement="top"
										content="Đăng nhập để được bình luận"
									>
										<div className="relative flex gap-2 pb-3">
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
									</Tooltip>
									{commentList.map((cmt, cmtIndex) => (
										<div
											key={cmt.id}
											className="py-2 flex justify-between gap-2 items-start"
										>
											<div className="flex items-start overflow-hidden">
												<div className="min-w-max">
													<Avatar
														size={30}
														src={cmt.avatar ? cmt.avatar : ''}
														alt={cmt.fullName}
													/>
												</div>
												<div className="break-words overflow-hidden ml-1">
													<span className="font-semibold pr-1">{cmt.fullName}</span>
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
					<ul className="h-72 pb-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2">
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
	tattooImages: PropTypes.array.isRequired,
	likes: PropTypes.array.isRequired,
	comments: PropTypes.array.isRequired,
	artist: PropTypes.object.isRequired
};

export default TattooSocial;
