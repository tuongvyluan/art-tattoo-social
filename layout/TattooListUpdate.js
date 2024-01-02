import { IoMdHeartEmpty, IoIosLink, IoMdHeart } from 'react-icons/io';
import PropTypes from 'prop-types';
import { Avatar, Link, Loading, WidgetPostCard } from 'ui';
import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { Tooltip } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { noImageAvailable } from 'lib/tattooPhoto';
import { fetcherDelete, fetcherPost } from 'lib';
import { BASE_URL } from 'lib/env';
import MyInfiniteScroll from 'ui/MyInfiniteScroll';

const TattooListUpdate = ({ url, pageSize = 20 }) => {
	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);

	const { status, data } = useSession();
	const [tattooCol, setTattooCol] = useState(2);
	const [loading, setLoading] = useState(true);
	const [key, setKey] = useState(1);
	const [postKey, setPostKey] = useState(1);

	const [shareTooltipContent, setShareTooltipContent] =
		useState('Copy link bài viết');

	const [authen, setAuthen] = useState(false);

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
				`${BASE_URL}/Media/DeleteLikeById?userId=${data?.user?.id}&artTattooId=${tattoo.id}`
			).catch((e) => console.log(e));
			tattoo.likeCount--;
			tattoo.isLike = false;
			setPostKey(Math.random());
		} else {
			fetcherPost(`${BASE_URL}/Media/CreateLike`, {
				accountId: data?.user?.id,
				tattooArtId: tattoo.id
			}).catch((e) => console.log(e));
			tattoo.likeCount++;
			tattoo.isLike = true;
			setPostKey(Math.random());
		}
	};

	const onResize = useCallback((event) => {
		const { innerWidth } = window;
		let cols = 2;
		if (innerWidth >= 640) {
			cols = 3;
		}
		if (innerWidth >= 768) {
			cols = 4;
		}
		if (innerWidth >= 1024) {
			cols = 5;
		}
		if (innerWidth >= 1280) {
			cols = 6;
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
		return <div></div>;
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

	if (status !== 'loading' && loading) {
		if (status === 'authenticated' && !authen) {
			setAuthen(true);
		}
		setLoading(false);
	}

	if (status === 'loading' || loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);
	}

	return (
		<div className="relative lg:mx-6">
			<div>
				<div>
					<div key={key}>
						<MyInfiniteScroll
							key={setKey}
							parentPage={page}
							setParentPage={setPage}
							parentItems={items}
							setParentItems={setItems}
							pageSize={pageSize}
							url={url}
							endMessage={endMessage()}
							loader={
								<div className="absolute w-full flex justify-center -bottom-12 pb-3">
									<Loading />
								</div>
							}
						>
							<div
								key={postKey}
								className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
							>
								{Array.from({ length: tattooCol }).map((col, colIndex) => (
									<div key={colIndex}>
										{items.map((item, index) => (
											<div key={index}>
												{index % tattooCol === colIndex && (
													<WidgetPostCard
														image={item.thumbnail ? item.thumbnail : noImageAvailable}
														link={`/tattoo/update/${item.id}${
															item.booking !== null && `?booking=${item.bookingId}`
														}&back=myTattoo`}
													>
														<div className="block">
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
																				<div
																					onClick={() => {
																						window.open('/auth/signin', 'blank');
																					}}
																				>
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
															<Link href={`/artist/${item.artistId}`}>
																<div className="cursor-pointer font-semibold pt-2">
																	<div className="flex gap-2">
																		<Avatar
																			src={item.avatar ? item.avatar : '/images/ATL.png'}
																			size={20}
																		/>
																		<div>{item.fullName}</div>
																	</div>
																</div>
															</Link>
														</div>
													</WidgetPostCard>
												)}
											</div>
										))}
									</div>
								))}
							</div>
						</MyInfiniteScroll>
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
