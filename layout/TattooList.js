import { IoMdHeartEmpty, IoIosLink, IoMdHeart } from 'react-icons/io';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { FiFilter } from 'react-icons/fi';
import PropTypes from 'prop-types';
import {
	Avatar,
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Link,
	Loading,
	WidgetPostCard
} from 'ui';
import { filterPlacement, filterSize } from 'lib/filterTattoo';
import { useCallback, useEffect, useState } from 'react';
import Pill from 'components/Pill';
import { tattooStyleList } from 'lib/tattooStyle';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { ChevronDown } from 'icons/solid';
import Button from 'components/Button';
import { Tooltip } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { noImageAvailable } from 'lib/tattooPhoto';
import { fetcherDelete, fetcherPost } from 'lib';
import { BASE_URL } from 'lib/env';
import MyInfiniteScroll from 'ui/MyInfiniteScroll';

const TattooListPage = ({
	url,
	pageSize = 20,
	showFilter = true,
	exceptId = ''
}) => {
	const [loading, setLoading] = useState(true);
	const [baseUrl, setBaseUrl] = useState(url);
	const [filterUrl, setFilterUrl] = useState(url);
	const [except, setExcept] = useState(exceptId);

	const [items, setItems] = useState([]);
	const [page, setPage] = useState(1);

	const { status, data } = useSession();
	const [tattooCol, setTattooCol] = useState(2);
	const [key, setKey] = useState(1);
	const [postKey, setPostKey] = useState(1);

	const firstRowStyle = [{ id: -1, name: 'Tất cả' }].concat(
		tattooStyleList.filter((s) => s.id < 16)
	);
	const secondRowStyle = tattooStyleList.filter((s) => s.id >= 16 && s.id < 31);
	const thirdRowStyle = tattooStyleList.filter((s) => s.id >= 31);

	const [visible, setVisible] = useState(false);
	const [showVisible, setShowVisible] = useState(false);
	const [shareTooltipContent, setShareTooltipContent] =
		useState('Copy link bài viết');

	const [filter, setFilter] = useState({
		sizeList: '-1',
		styleId: -1,
		image: '-1',
		hasColor: 0,
		positions: 0
	});
	const [authen, setAuthen] = useState(false);

	const [showMoreFilter, setShowMoreFilter] = useState(false);
	const router = useRouter();
	const search = router.query.search ? router.query.search : '';
	const [searchKey, setSearchKey] = useState(search);

	const handleFilterChange = (name, value) => {
		if (filter[name] !== value) {
			setFilter({
				...filter,
				[name]: value
			});
		}
	};

	const handleSearchChange = (e) => {
		setSearchKey(e.target.value);
	};

	const handleCopyLink = (id) => {
		setShareTooltipContent('Copy link thành công');
		navigator.clipboard.writeText(`${window.location.origin}/tattoo/${id}`);
	};

	const handleSetLike = debounce((tattoo) => {
		handleCallLikeApi(tattoo);
	}, 100);

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

	const onScroll = useCallback((event) => {
		const { scrollY } = window;
		let base = 88;
		if (showMoreFilter) {
			base += 139;
		}
		if (scrollY > base) {
			setShowVisible(true);
		} else {
			setVisible(false);
			setShowVisible(false);
		}
	}, []);

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

	const onKeyDown = (e) => {
		handleKeyDown(e);
	};

	const handleKeyDown = debounce((e) => {
		if (e.keyCode === 13 || e.key === 'Enter') {
			handleSearch();
		}
	}, 300);

	const handleSearch = () => {
		console.log(searchKey);
	};

	const endMessage = () => {
		if (items.length === 0) {
			return (
				<div className="absolute text-base w-full text-center -bottom-12 pb-3">
					Không tồn tại hình xăm nào
				</div>
			);
		}
		return <div></div>;
	};

	useEffect(() => {
		setKey(Math.random());
	}, [filterUrl]);

	useEffect(() => {
		setItems([]);
		setPage(1);
		let newUrl = baseUrl;
		if (!newUrl.includes('?', 0)) {
			newUrl = newUrl.concat('?');
		}
		if (filter.styleId !== -1) {
			newUrl = newUrl.concat(`&styleId=${filter.styleId}`);
		}
		if (filter.sizeList !== '-1') {
			newUrl = newUrl.concat(`&sizeList=${filter.sizeList}`);
		}
		if (filter.positions !== 0) {
			newUrl = newUrl.concat(`&positions=${filter.positions - 1}`);
		}
		if (filter.hasColor !== 0) {
			newUrl = newUrl.concat(`&hasColor=${filter.hasColor}`);
		}
		setFilterUrl(newUrl);
	}, [filter]);

	useEffect(() => {
		setExcept(exceptId);
	}, [exceptId]);

	useEffect(() => {
		//add eventlistener to window
		onResize();
		window.addEventListener('scroll', debounce(onScroll, 100, true));
		window.addEventListener('resize', debounce(onResize, 100, true));
		// remove event on unmount to prevent a memory leak with the cleanup
		return () => {
			window.removeEventListener('scroll', debounce(onScroll, 100, true));
			window.removeEventListener('resize', debounce(onResize, 100, true));
		};
	}, []);

	if (status !== 'loading' && loading) {
		if (status === 'authenticated') {
			const newUrl = baseUrl.concat(`?AccountId=${data?.user?.id}`);
			setBaseUrl(newUrl);
			setFilterUrl(newUrl);
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
			<div
				role="button"
				onClick={() => setVisible(!visible)}
				className={`fixed ${
					!showVisible ? 'hidden' : ''
				} w-10 z-50 right-5 bottom-5 bg-gray-700 text-white border border-gray-300 rounded-full cursor-pointer`}
			>
				<Tooltip
					arrow={false}
					content={visible ? 'Ẩn thanh tìm kiếm' : 'Hiện thanh tìm kiếm'}
					placement="left-start"
				>
					<FiFilter size={40} className="p-2 " />
				</Tooltip>
			</div>
			{showFilter && (
				<div
					className={`w-full z-10 pb-2 mb-2 bg-gray-50 ${
						visible ? 'fixed top-11 pt-7 pr-12' : ''
					}`}
				>
					<div className="flex flex-wrap justify-between gap-3">
						{
							// Search tattoo
						}
						<div className="sm:w-96 w-full min-w-max">
							<h1 className="font-semibold">Tìm kiếm</h1>
							<div className="relative">
								<input
									value={searchKey}
									type="text"
									onChange={handleSearchChange}
									onKeyDown={onKeyDown}
									aria-label={'Search'}
									name="search"
									className="appearance-none relative block w-full px-3 py-3 border-2 border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
									placeholder={'Tìm kiếm'}
								/>
								<div
									role="button"
									className="absolute right-3 text-gray-500 z-20 top-3"
									onClick={handleSearch}
								>
									<HiMiniMagnifyingGlass
										className="hover:text-gray-600 cursor-pointer"
										size={20}
									/>
								</div>
							</div>
						</div>
						<div className={`flex flex-wrap gap-3 px-1 ${visible ? 'mr-7' : ''}`}>
							<div className="flex gap-3">
								{
									// Filter size
								}
								<div>
									<h1 className="font-semibold">Size</h1>
									<Dropdown className={'relative'}>
										<DropdownToggle>
											<div className="w-36 relative">
												<div className="appearance-none block w-full px-3 py-3 ring-1 bg-white ring-gray-300 dark:ring-gray-300 rounded-lg text-sm">
													{filterSize().get(filter.sizeList)}
												</div>
												<ChevronDown
													width={20}
													height={20}
													className="absolute right-2 top-3"
												/>
											</div>
										</DropdownToggle>
										<DropdownMenu className={'top-2 -right-0 fixed z-40'}>
											<div className="">
												<ul className="h-32 overflow-y-auto">
													{[...filterSize()].map(([key, value], sizeIndex) => (
														<li
															onClick={() => handleFilterChange('sizeList', key)}
															className={`cursor-pointer px-2 py-1 text-center text-gray-800 ${
																key === filter.sizeList
																	? 'text-black bg-gray-50'
																	: 'hover:text-black hover:bg-gray-50'
															}`}
															key={key}
														>
															{value}
														</li>
													))}
												</ul>
											</div>
										</DropdownMenu>
									</Dropdown>
								</div>
							</div>
							<div className="flex gap-3">
								{
									// Filter placement
								}
								<div>
									<h1 className="font-semibold">Vị trí xăm</h1>
									<Dropdown className={'relative'}>
										<DropdownToggle>
											<div className="w-32 relative">
												<div className="appearance-none block w-full px-3 py-3 ring-1 bg-white ring-gray-300 dark:ring-gray-300 rounded-lg text-sm">
													{filterPlacement.at(filter.positions)}
												</div>
												<ChevronDown
													width={20}
													height={20}
													className="absolute right-2 top-3"
												/>
											</div>
										</DropdownToggle>
										<DropdownMenu className={'top-2 -right-6 fixed z-40'}>
											<div className="">
												<ul className="h-32 overflow-y-auto">
													{filterPlacement.map((placement, placementIndex) => (
														<li
															onClick={() =>
																handleFilterChange('positions', placementIndex)
															}
															className={`cursor-pointer px-2 py-1 text-center text-gray-800 ${
																placementIndex === filter.positions
																	? 'text-black bg-gray-50'
																	: 'hover:text-black hover:bg-gray-50'
															}`}
															key={placement}
														>
															{placement}
														</li>
													))}
												</ul>
											</div>
										</DropdownMenu>
									</Dropdown>
								</div>
								{
									// Show more filter button
								}
								<div>
									<h1 className="font-semibold">Thêm</h1>
									<Tooltip
										arrow={false}
										content="Chọn theo style"
										placement="bottom-end"
									>
										<Button
											onClick={() => {
												setShowMoreFilter(!showMoreFilter);
											}}
											outline
											className="border-2 border-gray-300"
										>
											<div className="flex gap-1 items-center py-1">
												<FiFilter size={12} />
												<div>Filters</div>
											</div>
										</Button>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
					{showMoreFilter && (
						<div>
							<div className="pt-2">
								<h1 className="font-semibold">Style</h1>
								<div className="overflow-x-auto">
									<div className="flex gap-2 items-center">
										{firstRowStyle.map((style, index) => (
											<div
												onClick={() => handleFilterChange('styleId', style.id)}
												className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
												key={style.id}
											>
												<Pill selected={filter.styleId === style.id}>
													{style.name}
												</Pill>
											</div>
										))}
									</div>
									<div className="flex gap-2 items-center">
										{secondRowStyle.map((style, index) => (
											<div
												onClick={() => handleFilterChange('styleId', style.id)}
												className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
												key={style.id}
											>
												<Pill selected={filter.styleId === style.id}>
													{style.name}
												</Pill>
											</div>
										))}
									</div>
									<div className="flex gap-2 items-center">
										{thirdRowStyle.map((style, index) => (
											<div
												onClick={() => handleFilterChange('styleId', style.id)}
												className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
												key={style.id}
											>
												<Pill selected={filter.styleId === style.id}>
													{style.name}
												</Pill>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
			<div>
				<div>
					<div>
						<MyInfiniteScroll
							key={key}
							url={filterUrl}
							parentItems={items}
							setParentItems={setItems}
							parentPage={page}
							setParentPage={setPage}
							endMessage={endMessage()}
							pageSize={pageSize}
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
										{items
											.filter((item) => item.id !== except)
											.map((item, index) => (
												<div key={item.id}>
													{index % tattooCol === colIndex && (
														<WidgetPostCard
															image={
																item.thumbnail !== '' && item.thumbnail
																	? item.thumbnail
																	: noImageAvailable
															}
															link={`/tattoo/${item.id}`}
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
																<Link
																	prefetch={false}
																	href={`/artist/${item.artistId}`}
																>
																	<div className="cursor-pointer font-semibold pt-2">
																		<div className="flex gap-2">
																			<Avatar
																				src={
																					item.avatar
																						? item.avatar
																						: '/images/ATL.png'
																				}
																				size={20}
																			/>
																			<div>{item.fullName}</div>
																		</div>
																	</div>
																</Link>
															</div>
															{/* <Link prefetch={false} href={`/tattoo/${item.id}`}>
															<div className="cursor-pointer">
																<div className="flex flex-wrap gap-1">
																	<StylePill>
																		{stringPlacements.at(item.placement)}
																	</StylePill>
																	<StylePill>
																		{tattooStyleMap.get(item.styleId).name}
																	</StylePill>
																	<StylePill>{stringSize.at(item.size)}</StylePill>
																</div>
															</div>
														</Link> */}
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

TattooListPage.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

TattooListPage.propTypes = {
	url: PropTypes.string.isRequired,
	pageSize: PropTypes.number,
	showFilter: PropTypes.bool,
	exceptId: PropTypes.string
};

export default TattooListPage;
