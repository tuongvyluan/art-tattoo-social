import { ChevronLeft } from 'icons/solid';
import { IoMdHeartEmpty, IoMdHeart, IoIosLink } from 'react-icons/io';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Avatar, Card, CardBody, Loading } from 'ui';
import { TattooArtCarousel } from 'ui/TattooArtCarousel';
import Button from 'components/Button';
import { stringSize } from 'lib/status';
import { useSession } from 'next-auth/react';
import debounce from 'lodash.debounce';
import { fetcherPost } from 'lib';
import { BASE_URL } from 'lib/env';
import { v4 } from 'uuid';

const TattooSocial = ({ tattoo, medias, artist, likes, comments }) => {
	const { status, data } = useSession();
	const [countLike, setCountLike] = useState(likes.length);
	const [myLike, setMyLike] = useState(false);
	const images = medias.map((media) => media.url);
	const [commentList, setCommentList] = useState(comments);
	const [myComment, setMyComment] = useState('');
	const [authen, setAuthen] = useState(false);

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
		if (!myLike && likes.filter((like) => like.accountId === data.user.id).length > 0) {
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
		if (myComment.trim().length > 0) {
			fetcherPost(`${BASE_URL}/Media/CreateComment`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id,
				content: myComment
			});
			const newCommentList = [{
			  id: v4(),
        accountId: data.user.id,
			  content: myComment,
			}]
			commentList.map((cmt) => {
			  newCommentList.push(cmt)
			})
			setCommentList(newCommentList)
			setMyComment('');
		}
	};

	const handleSetLike = () => {
    if (!myLike) {
      fetcherPost(`${BASE_URL}/Media/CreateLike`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id
			})
    } else {
      fetcherPost(`${BASE_URL}/Media/DeleteLikeById`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id
			})
    }
		setMyLike(!myLike);
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
						<div className="w-full lg:w-2/3">
							<TattooArtCarousel imageHeight={600} images={images} />
						</div>
						<div className="w-full lg:w-1/3 pt-3 pb-3 h-152 overflow-auto">
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
							<div className="px-5 py-3 border-b-2 border-t-2 border-gray-200">
								<div className="flex gap-2 pb-3">
									<div className="px-2 bg-gray-700 text-white rounded-2xl shadow-2xl cursor-pointer">
										{tattoo.style.name}
									</div>
									<div className="px-2 bg-white bg-gray-700 text-white rounded-2xl shadow-2xl cursor-pointer">
										{stringSize.at(tattoo.size)}
									</div>
								</div>
								<div className="pb-3">{tattoo.description}</div>
								<div className="flex items-start gap-1">
									<div className="flex gap-1 items-center">
										{authen ? (
											<div onClick={handleSetLike}>
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
									<div className="flex gap-1 items-center cursor-pointer">
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
								</div>
							</div>
							<div className="px-5 pt-3">
								<div className="text-base font-semibold">Bình luận</div>
								<div className="pt-1">
									{commentList.length === 0 && (
										<div>Hãy là người bình luận đầu tiên</div>
									)}
									<div>
										<input
											aria-label={'Comment'}
											name="comment"
											type="text"
											value={myComment}
											onChange={handleSetComment}
											onKeyDown={onKeyDown}
											className="myInteraction appearance-none relative block w-full px-3 py-3 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
											placeholder={'Thêm bình luận'}
										/>
									</div>
									{commentList.map((cmt, cmtIndex) => (
										<div key={cmt.id} className="py-2 flex gap-1 items-center">
											<Avatar size={30} src={''} alt={cmt.id} />
											<div>
												<span className="font-semibold pr-1">Trân Nguyễn</span>
												{cmt.content}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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
