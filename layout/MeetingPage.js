import Button from 'components/Button';
import Heading from 'components/Heading';
import { ChevronDown } from 'icons/outline';
import {
	extractServiceFromBookingDetail,
	fetcher,
	formatDate,
	formatDateForInput,
	formatTime
} from 'lib';
import { BASE_URL } from 'lib/env';
import {
	ROLE,
	stringBookingMeetingColors,
	stringBookingMeetingStatus
} from 'lib/status';
import moment from 'moment';
import PropTypes from 'propTypes';
import { useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'ui';
import { Badge } from 'flowbite-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { vi } from 'date-fns/locale';
import MyPagination from 'ui/MyPagination';

const statusList = [
	{
		key: -1,
		value: 'Tất cả lịch hẹn'
	}
].concat(
	stringBookingMeetingStatus.map((bm, index) => {
		return {
			key: index,
			value: bm
		};
	})
);

const MeetingSchedule = ({ role, id }) => {
	const [meetings, setMeetings] = useState([]);
	const [timeRange, setTimeRange] = useState({
		from: new Date(moment()),
		to: new Date(moment().add(12, 'hours').add(7, 'days'))
	});
	const [status, setStatus] = useState(-1);
	const [searchKey, setSearchKey] = useState(Math.random());
	const [hasChanged, setHasChanged] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const pageSize = 10;

	const getMeetings = () => {
		if (hasChanged) {
			fetcher(
				`${BASE_URL}/booking-meetings?from=${formatDateForInput(
					timeRange.from
				)}&to=${formatDateForInput(timeRange.to)}&${
					role === ROLE.ARTIST ? 'artist' : 'customer'
				}Id=${id}&orderBy=MeetingTime${
					status > -1 ? '&status=' + status : ''
				}&pageSize=${pageSize}&page=${page}`
			).then((data) => {
				setTotalPage(Math.ceil(data.total / pageSize))
				setMeetings(data.bookingMeetings);
				setHasChanged(false);
			});
		}
	};

	const getArtistOrCustomer = (meeting) => {
		if (role === ROLE.CUSTOMER) {
			return meeting.artist?.account?.fullName
				? meeting.artist.account.fullName
				: 'Nghệ sĩ bất kì';
		}
		return meeting.customer.fullName;
	};

	const handleSearch = () => {
		if (hasChanged) {
			setPage(1)
			setSearchKey(Math.random());
		}
	};

	useEffect(() => {
		if (!hasChanged) {
			setHasChanged(true);
		}
	}, [timeRange, status]);

	useEffect(() => {
		setHasChanged(true)
		setSearchKey(Math.random() + page);
	}, [page])

	useEffect(() => {
		getMeetings();
	}, [searchKey]);

	return (
		<div className="relative min-h-body sm:px-8 md:px-1 lg:px-6 xl:px-56 flex flex-col">
			<div className="flex-grow relative min-w-0 p-6 rounded-lg shadow-sm mb-4 w-full bg-white dark:bg-gray-600">
				<Heading>Lịch hẹn</Heading>
				{
					// filters
				}
				<div className="flex flex-wrap gap-2 pb-5">
					{
						// By Timerange
					}
					<div className="flex justify-center">
						<div>
							<Dropdown className="relative">
								<DropdownToggle>
									<div className="appearance-none relative block w-full px-3 py-2.5 ring-1 ring-gray-300 dark:ring-gray-600 ring-opacity-80 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 text-base leading-none">
										Từ{' '}
										<span className="font-semibold">
											{formatDate(timeRange?.from)}
										</span>{' '}
										tới{' '}
										<span className="font-semibold">{formatDate(timeRange?.to)}</span>
									</div>
								</DropdownToggle>
								<DropdownMenu position="left" closeOnClick={false}>
									<div className="w-full">
										<DayPicker
											showOutsideDays
											numberOfMonths={2}
											pagedNavigation
											id={'meetingPagePicker'}
											mode="range"
											defaultMonth={timeRange?.from}
											selected={timeRange}
											onSelect={setTimeRange}
											locale={vi}
											className=""
										/>
									</div>
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>
					{
						// By Status
					}
					<Dropdown className="relative h-full flex items-center">
						<DropdownToggle>
							<div className="relative">
								<div className="w-32 rounded-lg px-1 py-2 border border-gray-300">
									{statusList.filter((s) => s.key === status).at(0).value}
								</div>
								<div className="absolute top-1.5 right-2 text-gray-700">
									<ChevronDown width={17} height={17} />
								</div>
							</div>
						</DropdownToggle>
						<DropdownMenu className={' h-40 overflow-auto'}>
							{statusList.map((s) => (
								<div
									role="button"
									key={s.key}
									onClick={() => {
										if (status !== s.key) {
											setStatus(s.key);
										}
									}}
									className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
										status === s.key ? 'bg-indigo-100' : ''
									}`}
								>
									{s.value}
								</div>
							))}
						</DropdownMenu>
					</Dropdown>
					{
						// Confirm search
					}
					<div className="">
						<Button onClick={handleSearch}>Tìm kiếm</Button>
					</div>
				</div>
				{
					// Table
				}
				{meetings?.length > 0 ? (
					<div>
						<div className="relative shadow-md sm:rounded-lg min-w-max overflow-x-auto mb-3">
							<table className="w-full min-w-max text-sm text-left text-gray-500">
								<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
									<tr>
										<th
											scope="col"
											className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
										>
											Thời gian hẹn
										</th>
										<th
											scope="col"
											className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
										>
											{role === ROLE.CUSTOMER ? 'Nghệ sĩ' : 'Khách hàng'}
										</th>
										<th
											scope="col"
											className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
										>
											Tiệm xăm
										</th>
										<th
											scope="col"
											className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
										>
											Nội dung hẹn
										</th>
										<th
											scope="col"
											className="px-4 py-3 w-40 bg-gray-50 dark:bg-gray-800"
										>
											Trạng thái
										</th>
									</tr>
								</thead>
								<tbody>
									{meetings?.map((meeting, meetingIndex) => (
										<tr key={meeting.id} className="text-base">
											<td
												scope="col"
												className="text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
											>
												{formatTime(meeting.meetingTime)}
											</td>
											<td
												scope="col"
												className="text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
											>
												{getArtistOrCustomer(meeting)}
											</td>
											<td
												scope="col"
												className="text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
											>
												{meeting.studio.studioName}
											</td>
											<td
												scope="col"
												className="w-1/3 text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
											>
												{extractServiceFromBookingDetail(meeting.bookingDetail)}
											</td>
											<td
												scope="col"
												className="text-left text-gray-900 px-4 py-3 bg-white dark:bg-gray-800"
											>
												<div className="flex flex-wrap">
													<Badge
														color={stringBookingMeetingColors.at(meeting.status)}
													>
														{stringBookingMeetingStatus.at(meeting.status)}
													</Badge>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{totalPage > 0 && (
							<MyPagination
								current={page}
								setCurrent={setPage}
								totalPage={totalPage}
							/>
						)}
					</div>
				) : (
					<div className=" flex-grow">Chưa có lịch hẹn.</div>
				)}
			</div>
		</div>
	);
};

MeetingSchedule.propTypes = {
	role: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired
};

export default MeetingSchedule;
