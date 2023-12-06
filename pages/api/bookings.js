import { randomFrom0To } from 'lib';
import {
	BOOKING_STATUS,
	SERVICE_SIZE,
	TATTOO_ART_STATUS,
	stringPlacements
} from 'lib/status';
import { randomPhoto } from 'lib/tattooPhoto';
import { tattooStyleList } from 'lib/tattooStyle';
import { v4 } from 'uuid';

const data = Array(20)
	.fill(0)
	.map((_, i) => {
		return {
			id: v4(),
			customer: {
				customerId: v4(),
				accountId: v4(),
				fullName: [
					'Vy',
					'Trân',
					'Trường',
					'Tân',
					'Thịnh',
					'Bảo',
					'Châu',
					'Dương',
					'Tuấn',
					'Đức'
				][randomFrom0To(10)],
				email: `email${[randomFrom0To(3)]}@gmail.com`,
				phoneNumber: '0912345678'
			},
			services: Array(1 + randomFrom0To(2))
				.fill(0)
				.map((_, i) => {
					return {
						id: v4(),
						minPrice: 1000000 + randomFrom0To(9) * 100000,
						maxPrice: 2000000 + randomFrom0To(9) * 100000,
						hasColor: Math.random() < 0.5,
						isDifficult: Math.random() < 0.5,
						size: [
							SERVICE_SIZE.EXTRA,
							SERVICE_SIZE.LARGE,
							SERVICE_SIZE.MEDIUM,
							SERVICE_SIZE.SMALL
						][randomFrom0To(4)],
						ink: '',
						placement: randomFrom0To(stringPlacements.length)
					};
				}),
			artTattoos: Array(1 + randomFrom0To(2))
				.fill(0)
				.map((_, i) => {
					return {
						id: [
							'4e52b109-e267-4aeb-9763-090fc60b21f1',
							'f73d647a-34e1-4cdf-88a5-3968d49bd577',
							'009f1723-6fdc-4ef9-b8c7-5569d0d3f29e',
							'0b8d9754-a833-467a-862a-7459fe6d8171',
							'ae439cd0-72e3-4215-9ae9-8464bc23c09b'
						][randomFrom0To(5)],
						style: tattooStyleList[randomFrom0To(45)],
						artist: {
							accountId: v4(),
							fullName: [
								'Vy',
								'Trân',
								'Trường',
								'Tân',
								'Thịnh',
								'Bảo',
								'Châu',
								'Dương',
								'Tuấn',
								'Đức'
							][randomFrom0To(10)],
							
						},
						photo: randomPhoto,
						size: [
							SERVICE_SIZE.EXTRA,
							SERVICE_SIZE.LARGE,
							SERVICE_SIZE.MEDIUM,
							SERVICE_SIZE.SMALL
						][randomFrom0To(4)],
						status: TATTOO_ART_STATUS.AVAILABLE,
						bookingDetails: [
							{
								bookingDetailsId: v4(),
								operationName: 'Xăm trọn gói',
								price: randomFrom0To(8) * 1200000 + 1000000
							}
						],
						placement: randomFrom0To(stringPlacements.length)
					};
				}),
			status: BOOKING_STATUS.IN_PROGRESS,
			// status: [
			// 	BOOKING_STATUS.IN_PROGRESS,
			// 	BOOKING_STATUS.COMPLETED,
			// 	BOOKING_STATUS.CANCELLED
			// ][randomFrom0To(3)],
			createdAt: new Date(),
			meetingDate: new Date(+new Date() + 200000000),
			total: randomFrom0To(8) * 1200000 + 1000000
		};
	});
const getBookingList = (req, res) => {
	if (req.query.id) {
		return res.json(data.at(0));
	}
	return res.json(data);
};
export default getBookingList;
