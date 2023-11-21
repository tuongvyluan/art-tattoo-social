import { IoMdHeartEmpty, IoIosLink } from 'react-icons/io';
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
import { useCallback, useEffect, useRef, useState } from 'react';
import Pill from 'components/Pill';
import { tattooStylesWithoutDescription } from 'lib/tattooStyle';
import { useRouter } from 'next/router';
import debounce from 'lodash.debounce';
import { ChevronDown } from 'icons/solid';
import Button from 'components/Button';

const TattooIndexPage = () => {
	const { items, error, size, setSize, isReachingEnd } = usePaginate(
		'/api/tattooArt',
		20
	);

	const firstRowStyle = [{ id: -1, name: 'Tất cả' }].concat(
		tattooStylesWithoutDescription.filter((s) => s.id < 16)
	);
	const secondRowStyle = tattooStylesWithoutDescription.filter(
		(s) => s.id >= 16 && s.id < 31
	);
	const thirdRowStyle = tattooStylesWithoutDescription.filter((s) => s.id >= 31);

	const [visible, setVisible] = useState(false);
	const [showVisible, setShowVisible] = useState(false);

	const [filter, setFilter] = useState({
		size: '-1',
		style: -1,
		image: '-1',
		hasColor: '-1',
		placement: 0
	});

	const [showMoreFilter, setShowMoreFilter] = useState(false);
	const router = useRouter();
	const search = router.query.search ? router.query.search : '';
	const [searchKey, setSearchKey] = useState(search);
	const tattooListRef = useRef()

	const handleFilterChange = (name, value) => {
		setFilter({
			...filter,
			[name]: value
		});
	};

	const handleSearchChange = (e) => {
		setSearchKey(e.target.value);
	};

	const onScroll = useCallback((event) => {
		const { scrollY } = window;
		let base = tattooListRef.current.offsetTop
		if (showMoreFilter) {
			base += 139
		}
		if (scrollY > base) {
			setShowVisible(true);
		} else {
			setVisible(false);
			setShowVisible(false);
		}
	}, []);

	useEffect(() => {
		//add eventlistener to window
		window.addEventListener('scroll', debounce(onScroll, 100, true));
		// remove event on unmount to prevent a memory leak with the cleanup
		return () => {
			window.removeEventListener('scroll', debounce(onScroll, 100, true));
		};
	}, []);

	if (error)
		return (
			<div className="flex items-center justify-center h-full">
				Failed to load data
			</div>
		);
	if (!items)
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);

	return (
		<div className="relative pt-2">
			<div
				onClick={() => setVisible(!visible)}
				className={`fixed ${
					!showVisible ? 'hidden' : ''
				} w-10 z-50 right-5 bottom-5 bg-gray-700 text-white border border-gray-700 rounded-full cursor-pointer`}
			>
				<FiFilter size={40} className="p-2 " />
			</div>
			<div
				className={`w-full z-10 pb-2 bg-gray-50 ${
					showMoreFilter ? 'overflow-x-auto' : ''
				} ${visible ? 'fixed top-11 pt-7' : ''}`}
			>
				<div className="flex flex-wrap justify-between gap-3">
					{
						// Search tattoo
					}
					<div className="sm:w-96 w-full min-w-max">
						<h1 className="font-semibold">Tìm kiếm</h1>
						<input
							value={searchKey}
							type="text"
							onChange={handleSearchChange}
							aria-label={'Search'}
							name="search"
							className="appearance-none relative block w-full px-3 py-3 border-2 border-gray-700 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-sm leading-none"
							placeholder={'Tìm kiếm'}
						/>
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
											<div className="appearance-none block w-full px-3 py-3 ring-1 ring-gray-700 dark:ring-gray-700 rounded-lg text-sm">
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
											<div className="appearance-none block w-full px-3 py-3 ring-1 ring-gray-700 dark:ring-gray-700 rounded-lg text-sm">
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
											<ul className="">
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
											<div className="appearance-none block w-full px-3 py-3 ring-1 ring-gray-700 dark:ring-gray-700 rounded-lg text-sm">
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
											<ul className="h-44 overflow-y-auto">
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
														key={placementIndex}
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
								<Button
									onClick={() => {
										setShowMoreFilter(!showMoreFilter);
									}}
									outline
									className="border-2 border-gray-700"
								>
									<div className="flex gap-1 items-center py-1">
										<FiFilter size={12} />
										<div>Filters</div>
									</div>
								</Button>
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
			<div ref={tattooListRef}>
				<div>
					<div className="pt-2">
						<InfiniteScroll
							dataLength={items.length}
							next={() => setSize(size + 1)}
							hasMore={isReachingEnd}
							loader={<Loading />}
							className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2"
						>
							{items.map((item, index) => (
								<WidgetPostCard
									key={index}
									image={item.thumbnail}
									imageHeight={200}
									link={`/tattoo/${item.id}`}
								>
									<div className="flex justify-between gap-2">
										<Link href={`/artist/${item.artist.id}`}>
											<div className="cursor-pointer font-semibold">
												{item.artist.name}
											</div>
										</Link>
										<div className="flex items-start gap-1">
											<div>
												<IoIosLink
													className="hover:text-gray-600 cursor-pointer"
													size={20}
												/>
											</div>
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
												Style: <span className="text-black">{item.style?.name}</span>
											</div>
										</div>
									</Link>
								</WidgetPostCard>
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
