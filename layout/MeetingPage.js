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
import { ROLE, stringBookingMeetingStatus } from 'lib/status';
import moment from 'moment';
import PropTypes from 'propTypes';
import { useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'ui';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { vi } from 'date-fns/locale';
import MyPagination from 'ui/MyPagination';
import MeetingTable from './MeetingTable';

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
				setTotalPage(Math.ceil(data.total / pageSize));
				setMeetings(data.bookingMeetings);
				setHasChanged(false);
			});
		}
	};

	const handleSearch = () => {
		if (hasChanged) {
			setPage(1);
			setSearchKey(Math.random());
		}
	};

	useEffect(() => {
		if (!hasChanged) {
			setHasChanged(true);
		}
	}, [timeRange, status]);

	useEffect(() => {
		setHasChanged(true);
		setSearchKey(Math.random() + page);
	}, [page]);

	useEffect(() => {
		getMeetings();
	}, [searchKey]);

	return (
		<div>
			<Heading>Lịch hẹn</Heading>
			{
				// filters
			}
			<div className="flex flex-wrap gap-2 pb-5 items-end">
				<div className="flex justify-center">
					<div>
						<div className="text-sm font-semibold">Chọn khoảng thời gian</div>
						<Dropdown className="relative">
							<DropdownToggle>
								<div className="relative">
									<div className="rounded-lg pl-1 pr-8 py-2 border border-gray-300">
										Từ{' '}
										<span className="font-semibold">
											{formatDate(timeRange?.from)}
										</span>{' '}
										tới{' '}
										<span className="font-semibold">
											{formatDate(timeRange?.to)}
										</span>
									</div>
									<div className="absolute top-2.5 right-2 text-gray-700">
										<ChevronDown width={17} height={17} />
									</div>
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
				<div>
					<div className="text-sm font-semibold">Chọn trạng thái</div>
					<Dropdown className="relative h-full flex items-center">
						<DropdownToggle>
							<div className="relative">
								<div className="w-32 rounded-lg px-1 py-2 border border-gray-300">
									{statusList.filter((s) => s.key === status).at(0).value}
								</div>
								<div className="absolute top-2.5 right-2 text-gray-700">
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
				</div>
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
					<MeetingTable role={role} meetings={meetings} />
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
	);
};

MeetingSchedule.propTypes = {
	role: PropTypes.number.isRequired,
	id: PropTypes.string.isRequired
};

export default MeetingSchedule;
