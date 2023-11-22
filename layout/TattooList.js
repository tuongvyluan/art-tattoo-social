import { IoMdHeartEmpty, IoIosLink, IoMdSend } from 'react-icons/io';
import { stringPlacements } from 'lib/status';
import { FiFilter } from 'react-icons/fi';
import { usePaginate } from 'lib/usePagination';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
	Dropdown,
	DropdownMenu,
	DropdownToggle,
	Link,
	Loading,
	WidgetPostCard
} from 'ui';
import { randomFrom0To } from 'lib';
import { filterColor, filterSize } from 'lib/filterTattoo';
import { useCallback, useEffect, useState } from 'react';
import Pill from 'components/Pill';
import { tattooStylesWithoutDescription } from 'lib/tattooStyle';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { ChevronDown } from 'icons/solid';
import Button from 'components/Button';
import { Tooltip } from 'flowbite-react';
import { useSession } from 'next-auth/react';

const TattooIndexPage = () => {
	const { items, error, size, setSize, isReachingEnd } = usePaginate(
		'/api/tattooArt',
		20
	);
	const { status, data } = useSession();
	const [tattooCol, setTattooCol] = useState(2);

	const firstRowStyle = [{ id: -1, name: 'Tất cả' }].concat(
		tattooStylesWithoutDescription.filter((s) => s.id < 16)
	);
	const secondRowStyle = tattooStylesWithoutDescription.filter(
		(s) => s.id >= 16 && s.id < 31
	);
	const thirdRowStyle = tattooStylesWithoutDescription.filter((s) => s.id >= 31);

	const [visible, setVisible] = useState(false);
	const [showVisible, setShowVisible] = useState(false);
	const [shareTooltipContent, setShareTooltipContent] =
		useState('Copy link bài viết');

	const [filter, setFilter] = useState({
		size: '-1',
		style: -1,
		image: '-1',
		hasColor: '-1',
		placement: 0
	});
	const [authen, setAuthen] = useState(false);

	const [showMoreFilter, setShowMoreFilter] = useState(false);
	const router = useRouter();
	const search = router.query.search ? router.query.search : '';
	const [searchKey, setSearchKey] = useState(search);

	const handleFilterChange = (name, value) => {
		setFilter({
			...filter,
			[name]: value
		});
	};

	const handleSearchChange = (e) => {
		setSearchKey(e.target.value);
	};

	const handleCopyLink = (id) => {
		setShareTooltipContent('Copy link thành công');
		navigator.clipboard.writeText(`${window.location.origin}/tattoo/${id}`);
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
		if (innerWidth >= 1024) {
			cols = 5;
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

	if (status === 'loading' || !items) {
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

	if (error)
		return (
			<div className="flex items-center justify-center h-full">
				Failed to load data
			</div>
		);

	return (
		<div className="relative">
			<div
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
			<div
				className={`w-full z-10 pb-4 bg-gray-50 ${
					showMoreFilter ? 'overflow-x-auto' : ''
				} ${visible ? 'fixed top-11 pt-7' : ''}`}
			>
				<div className="flex flex-wrap justify-between gap-3">
					{
						// Search tattoo
					}
					<div className="sm:w-96 w-full min-w-max">
						<h1 className="font-semibold">Tìm kiếm</h1>
						<div className="flex gap-2 items-center">
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
							<button onClick={handleSearch}>
								<IoMdSend className="hover:text-gray-600 cursor-pointer" size={20} />
							</button>
						</div>
					</div>
					<div className={`flex flex-wrap gap-3 px-1 ${visible ? 'mr-7' : ''}`}>
						<div className="flex gap-3">
							{
								// Filter color
							}
							<div>
								<h1 className="font-semibold">Màu sắc</h1>
								<Dropdown className={'relative'}>
									<DropdownToggle>
										<div className="w-28 relative">
											<div className="appearance-none block w-full px-3 py-3 ring-1 bg-white ring-gray-300 dark:ring-gray-300 rounded-lg text-sm">
												{filterColor().get(filter.hasColor)}
											</div>
											<ChevronDown
												width={20}
												height={20}
												className="absolute right-2 top-3"
											/>
										</div>
									</DropdownToggle>
									<DropdownMenu className={'top-2 -right-10 fixed z-40'}>
										<div className="">
											<ul className="">
												{[...filterColor()].map(([key, value], colorIndex) => (
													<li
														onClick={() => handleFilterChange('hasColor', key)}
														className={`cursor-pointer p-2 text-center text-gray-800 ${
															key === filter.hasColor
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
							{
								// Filter size
							}
							<div>
								<h1 className="font-semibold">Size</h1>
								<Dropdown className={'relative'}>
									<DropdownToggle>
										<div className="w-32 relative">
											<div className="appearance-none block w-full px-3 py-3 ring-1 bg-white ring-gray-300 dark:ring-gray-300 rounded-lg text-sm">
												{filterSize().get(filter.size)}
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
												{[...filterSize()].map(([key, value], sizeIndex) => (
													<li
														onClick={() => handleFilterChange('size', key)}
														className={`cursor-pointer p-2 text-center text-gray-800 ${
															key === filter.size
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
												{stringPlacements.at(filter.placement)}
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
												{stringPlacements.map((placement, placementIndex) => (
													<li
														onClick={() =>
															handleFilterChange('placement', placementIndex)
														}
														className={`cursor-pointer p-2 text-center text-gray-800 ${
															placementIndex === filter.placement
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
									placement="bottom-start"
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
							<div className="">
								<div className="flex gap-2 items-center">
									{firstRowStyle.map((style, index) => (
										<div
											onClick={() => handleFilterChange('style', style.id)}
											className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
											key={style.id}
										>
											<Pill selected={filter.style === style.id}>{style.name}</Pill>
										</div>
									))}
								</div>
								<div className="flex gap-2 items-center">
									{secondRowStyle.map((style, index) => (
										<div
											onClick={() => handleFilterChange('style', style.id)}
											className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
											key={style.id}
										>
											<Pill selected={filter.style === style.id}>{style.name}</Pill>
										</div>
									))}
								</div>
								<div className="flex gap-2 items-center">
									{thirdRowStyle.map((style, index) => (
										<div
											onClick={() => handleFilterChange('style', style.id)}
											className="flex min-w-max items-center gap-1 py-1 cursor-pointer"
											key={style.id}
										>
											<Pill selected={filter.style === style.id}>{style.name}</Pill>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div>
				<div>
					<div>
						<InfiniteScroll
							dataLength={items.length}
							next={() => setSize(size + 1)}
							hasMore={isReachingEnd}
							loader={<Loading />}
							className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
						>
							{Array.from({ length: tattooCol }).map((col, colIndex) => (
								<div key={colIndex}>
									{items.map((item, index) => (
										<div key={index}>
											{index % tattooCol === colIndex && (
												<WidgetPostCard
													image={item.thumbnail}
													link={`/tattoo/${item.id}`}
												>
													<div className="flex justify-between gap-2">
														<Link href={`/artist/${item.artist.id}`}>
															<div className="cursor-pointer font-semibold">
																{item.artist.name}
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
																	<IoMdHeartEmpty
																		className="hover:text-gray-600 font-semibold cursor-pointer"
																		size={20}
																	/>
																</div>
																<div className="flex gap-1 items-end text-gray-700">
																	<div className="text-left text-xs font-semibold w-14">
																		{2 + randomFrom0To(30)} likes
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
																	{item.style?.name}
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

TattooIndexPage.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

export default TattooIndexPage;
