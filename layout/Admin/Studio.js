import { Table } from 'components/Table';
import React from 'react';
import { Loading } from 'ui';
import { fetcher } from 'lib';
import useSWR from 'swr';
import { Title } from 'ui/Title';

function AdminStudioPage() {
	const columns = React.useMemo(
		() => [
			{
				Header: 'Studio',
				columns: [
					{
						Header: 'Name',
						accessor: 'owner.fullName'
					},
					{
						Header: 'Address',
						accessor: 'address'
					},
					{
						Header: 'Rating',
						accessor: 'rating'
					}
				]
			},
			{
				Header: 'Status',
				columns: [
					{
						Header: 'Approved',
						accessor: 'approveStatus'
					},
					{
						Header: 'Active',
						accessor: 'activeStatus'
					}
				]
			}
		],
		[]
	);

	const baseUrl = `${process.env.NEXT_PUBLIC_API_BASEURL}/Studios`;

	const { data, error } = useSWR(baseUrl, fetcher);
	if (error)
		return (
			<div className="flex items-center justify-center h-full">
				Failed to load table data
			</div>
		);
	if (!data)
		return (
			<div className="flex items-center justify-center h-full">
				<Loading />
			</div>
		);

	return (
		<div>
			<Title>Studio</Title>
			<Table data={data} columns={columns} />
		</div>
	);
}

export default AdminStudioPage;
