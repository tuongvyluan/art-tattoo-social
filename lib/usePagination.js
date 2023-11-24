import { useSWRInfinite } from 'swr';
import { fetcher } from './fetcher';

const baseUrl = '';

export const usePaginate = (path, pageSize) => {
	if (!path) {
		throw new Error('Path is required');
	}

	let url = baseUrl + path;

	if (!url.includes('?', 0)) {
		url = url.concat('?');
	} else {
		url = url.concat('&');
	}

	const { data, error, size, setSize } = useSWRInfinite(
		(index) => `${url}page=${index + 1}&pageSize=${pageSize}`,
		fetcher
	);

	const items = data ? [].concat(...data) : [];
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(size > 0 && data && typeof data[size - 1] === 'undefined');
	console.log(size);

	return { items, error, isLoadingMore, size, setSize };
};
