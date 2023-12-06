import React, { useEffect, useState } from 'react';
import { fetcher } from 'lib';
import TattooStudioTabs from 'components/TattooStudioTabs';
import Link from 'next/link';
import { BASE_URL } from 'lib/env';
import { BackgroundImg } from 'ui';

function AdminStudioPage() {
	const [items, setItems] = useState([]);
	const [error, setError] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const pageSize = 30;

	useEffect(() => {
		fetcher(`${BASE_URL}/studios`)
			.then((data) => {
				setItems(data.studios);
				setTotalPage(Math.ceil(data.total / pageSize));
			})
			.catch((e) => {
				setError(true);
			});
	}, []);

	useEffect(() => {
		fetcher(`${BASE_URL}/studios?page=${page}&pageSize=${pageSize}`)
			.then((data) => {
				setItems(data.studios);
			})
			.catch((e) => {
				setError(true);
			});
	}, [page]);

	if (error) {
		return (
			<div>
				<TattooStudioTabs />
				<div className="flex items-center justify-center h-full">
					Tải dữ liệu thất bại
				</div>
			</div>
		);
	}

	return (
		<div>
			<TattooStudioTabs />
			<div className="relative lg:mx-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5">
				{items?.map((studio) => (
					<div key={studio.id}>
						<div>
							<BackgroundImg
								className="relative w-full bg-center bg-cover"
								height={250}
								image={studio.avatar ? studio.avatar : '/images/ATL.png'}
							/>
						</div>
						<div>
							<Link href={`/studio/${studio.id}`}>
								<div>{studio.studioName}</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default AdminStudioPage;
