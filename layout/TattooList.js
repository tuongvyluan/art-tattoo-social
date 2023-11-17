import { IoMdHeartEmpty, IoIosLink } from 'react-icons/io';
import { stringPlacements, stringSize } from 'lib/status';
import { usePaginate } from 'lib/usePagination';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card, CardBody, Link, Loading, WidgetPostCard } from 'ui';
import { randomFrom0To } from 'lib';
import { filterColor, filterSize } from 'lib/filterTattoo';
import { useState } from 'react';

const TattooIndexPage = () => {
	const { items, error, isLoadingMore, size, setSize, isReachingEnd } = usePaginate(
		'/api/tattooArt',
		20
	);
	
	const [filter, setFilter] = useState({
		size: '-1',
		style: '-1',
		image: '-1',
		hasColor: '-1',
		placement: '-1'
	});

	console.log(filter)

	const handleFilterChange = (name, value) => {
		setFilter({
			...filter,
			[name]: value
		});
	};

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
		<div className="relative">
			<div className="w-48 top-16 mt-2.5 left-4 bottom-5 overflow-y-auto fixed z-10">
				<div className={'h-full relative min-w-0 break-words rounded-lg overflow-hidden shadow-md w-full bg-white dark:bg-gray-600'}>
					<CardBody>
						<div>
							<h1 className="font-semibold">Size</h1>
							{[...filterSize()].map(([key, value], sizeIndex) => (
								<div onClick={() => handleFilterChange('size', key)} className="flex items-center gap-1 py-1 cursor-pointer" key={key}>
									<input
										onChange={() => handleFilterChange('size', key)}
										type="radio"
										name="size"
										value={key}
										checked={filter.size === key}
										className="w-3 h-3"
									/>
									<div>{value}</div>
								</div>
							))}
						</div>
						<div>
							<h1 className="font-semibold pt-3">Màu sắc</h1>
							{[...filterColor()].map(([key, value], colorIndex) => (
								<div onClick={() => handleFilterChange('hasColor', key)} className="flex items-center gap-1 py-1 cursor-pointer" key={key}>
									<input
										onChange={() => handleFilterChange('hasColor', key)}
										value={value}
										type="radio"
										name="hasColor"
										checked={filter.hasColor === key}
										className="w-3 h-3"
									/>
									<div>{value}</div>
								</div>
							))}
						</div>
					</CardBody>
				</div>
			</div>
			<div className="pl-52">
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
							images={item.tattooMedias.map((media) => media.url)}
							imageHeight={200}
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
											<div className="text-center text-xs font-semibold">
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
	);
};

TattooIndexPage.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

export default TattooIndexPage;
