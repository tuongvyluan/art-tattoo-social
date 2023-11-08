import { usePaginate } from 'lib/usePagination';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loading, WidgetPostCard } from 'ui';

const Index = () => {
	const { items, error, isLoadingMore, size, setSize, isReachingEnd } = usePaginate('/api/tattooArt', 20)

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
		<div className='px-96'>
			<InfiniteScroll
				dataLength={items.length}
				next={() => setSize(size + 1)}
				hasMore={isReachingEnd}
				loader={<Loading />}
			>
				{items.map((item) => (
					<WidgetPostCard
						key={item.tattooArtId}
						title={item.artist.artistName}
						text={item.description}
						images={item.tattooMedias.map((media) => media.url)}
						imageHeight={600}
					/>
				))}
			</InfiniteScroll>
		</div>
	);
};

Index.getInitialProps = async () => ({
	namespacesRequired: ['header', 'footer', 'sidebar']
});

export default Index;
