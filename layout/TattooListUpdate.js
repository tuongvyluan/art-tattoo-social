import { IoMdHeartEmpty, IoIosLink, IoMdHeart } from 'react-icons/io';
import { stringPlacements, stringSize } from 'lib/status';
import { usePaginate } from 'lib/usePagination';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import {
	Link,
	Loading,
	WidgetPostCard
} from 'ui';
import { useCallback, useEffect, useState } from 'react';
import { tattooStyleMap } from 'lib/tattooStyle';
import debounce from 'lodash.debounce';
import { Tooltip } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { randomPhoto } from 'lib/tattooPhoto';
import { fetcherDelete, fetcherPost } from 'lib';
import { BASE_URL } from 'lib/env';

const TattooListUpdate = ({ url, pageSize = 20 }) => {
	const { items, error, size, setSize } = usePaginate(url, pageSize);

	const { status, data } = useSession();
	const [tattooCol, setTattooCol] = useState(2);
	const [key, setKey] = useState(1);

	const [shareTooltipContent, setShareTooltipContent] =
		useState('Copy link bài viết');

	const [authen, setAuthen] = useState(false);

	const [isReachingEnd, setIsReachingEnd] = useState(false);

	const handleCopyLink = (id) => {
		setShareTooltipContent('Copy link thành công');
		navigator.clipboard.writeText(`${window.location.origin}/tattoo/${id}`);
	};

	const handleSetLike = debounce((tattoo) => {
		handleCallLikeApi(tattoo);
	}, 200);

	const handleCallLikeApi = (tattoo) => {
		if (tattoo.isLike) {
			fetcherDelete(
				`${BASE_URL}/Media/DeleteLikeById?userId=${data.user.id}&artTattooId=${tattoo.id}`
			).catch((e) => console.log(e));
			tattoo.likeCount--;
			tattoo.isLike = false;
			setKey(Math.random());
		} else {
			fetcherPost(`${BASE_URL}/Media/CreateLike`, {
				accountId: data.user.id,
				tattooArtId: tattoo.id
			}).catch((e) => console.log(e));
			tattoo.likeCount++;
			tattoo.isLike = true;
			setKey(Math.random());
		}
	};

	const onResize = useCallback((event) => {
		const { innerWidth } = window;
		let cols = 2;
		if (innerWidth >= 640) {
			cols = 3;
		}
		if (innerWidth >= 1024) {
			cols = 5;
		}
		setTattooCol(cols);
	}, []);

	const endMessage = () => {
		if (items.length === 0) {
			return (
				<div className="absolute text-base w-full text-center -bottom-7 pb-3">
					Không tồn tại hình xăm nào
				</div>
			);
		}
		return (
			<div className="absolute text-base w-full text-center -bottom-7 pb-3">
				Đã tải hết hình xăm
			</div>
		);
	};

	useEffect(() => {
		//add eventlistener to window
		onResize();
		window.addEventListener('resize', debounce(onResize, 100, true));
		// remove event on unmount to prevent a memory leak with the cleanup
		return () => {
			window.removeEventListener('resize', debounce(onResize, 100, true));
		};
	}, []);

	if (status === 'loading' || !items || (items.length === 0 && !error)) {
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

	if (error && !isReachingEnd) {
		setIsReachingEnd(true);
	}

	return (
		<div className="relative">
			<div>
				<div>
					<div key={key}>
						<InfiniteScroll
							dataLength={items.length}
							next={() => setSize(size + 1)}
							hasMore={!isReachingEnd}
							endMessage={endMessage()}
							loader={
								<div className="absolute w-full flex justify-center -bottom-7 pb-3">
									<Loading />
								</div>
							}
							className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
						>
							{Array.from({ length: tattooCol }).map((col, colIndex) => (
								<div key={colIndex}>
									{items.map((item, index) => (
										<div key={index}>
											{index % tattooCol === colIndex && (
												<WidgetPostCard
													image={item.thumbnail ? item.thumbnail : randomPhoto}
													link={`/tattoo/update/${item.id}`}
												>
													<div className="flex justify-between gap-2">
														<Link href={`/artist/${item.artistId}`}>
															<div className="cursor-pointer font-semibold">
																{item.firstName} {item.lastName}
															</div>
														</Link>
														<div className="flex items-start gap-1">
															<Tooltip
																arrow={false}
																onMouseLeave={() =>
																	setShareTooltipContent('Copy link bài viết')
																}
																content={shareTooltipContent}
																placement="bottom"
															>
																<div
																	onClick={() => handleCopyLink(item.id)}
																	className="flex gap-1 items-center cursor-pointer"
																>
																	<IoIosLink
																		className="hover:text-gray-600 cursor-pointer"
																		size={20}
																	/>
																</div>
															</Tooltip>
															<div className="flex gap-1 items-center">
																<div>
																	{authen ? (
																		<div onClick={() => handleSetLike(item)}>
																			{item.isLike ? (
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
																</div>
																<div className="flex gap-1 items-end text-gray-700">
																	<div className="text-left text-xs font-semibold w-14">
																		{item.likeCount} thích
																	</div>
																</div>
															</div>
														</div>
													</div>
													<Link href={`/tattoo/${item.id}`}>
														<div className="cursor-pointer">
															<div className="text-gray-400">
																Vị trí xăm:{' '}
																<span className="text-black">
																	{stringPlacements.at(item.placement)}
																</span>
															</div>
															<div className="text-gray-400">
																Style:{' '}
																<span className="text-black">
																	{tattooStyleMap.get(item.styleId).name}
																</span>
															</div>
															<div className="text-gray-400">
																Size:{' '}
																<span className="text-black">
																	{stringSize.at(item.size)}
																</span>
															</div>
														</div>
													</Link>
												</WidgetPostCard>
											)}
										</div>
									))}
								</div>
							))}
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</div>
	);
};

TattooListUpdate.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

TattooListUpdate.propTypes = {
	url: PropTypes.string.isRequired,
	pageSize: PropTypes.number
};

export default TattooListUpdate;
