import MoneyInput from 'components/MoneyInput';
import { stringServicePlacement } from 'lib/status';
import {
	getColor,
	getDifficult,
	getPlacement,
	getSize,
	serviceListToMap
} from 'lib/studioServiceHelper';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Card, CardBody, Ripple } from 'ui';

const SIZE_TAB = '1';
const PLACEMENT_TAB = '2';

function ServicePage({ services, onChange }) {
	const [serviceList, setServiceList] = useState(
		JSON.parse(JSON.stringify(services))
	);
	const serviceMap = serviceListToMap(serviceList);
	const [selectedServices, setSelectedServices] = useState(new Map());
	const [key, setKey] = useState(Math.random());

	const sizeMap = new Map(
		[...serviceMap]
			.filter(([key, value]) => key < 30)
			.sort(([key1, value1], [key2, value2]) => key1 - key2)
	);

	const placementMap = new Map(
		[...serviceMap]
			.filter(([key, value]) => key >= 100)
			.sort(([key1, value1], [key2, value2]) => key1 - key2)
	);
	const sizeList = ['Size S (<8cm)', 'Size M (8-15cm)', 'Size L (15-30cm)'];

	const [activeTab, setActiveTab] = useState('1');

	const handleSelectService = (key) => {
		if (selectedServices.has(key)) {
			selectedServices.delete(key);
		} else {
			selectedServices.set(key, {
				minPrice: serviceMap.get(key).minPrice,
				maxPrice: serviceMap.get(key).maxPrice
			});
		}
		onChange(serviceMap.get(key));
		setKey(Math.random());
	};

	const toggle = (tab) => {
		if (activeTab !== tab) {
			setActiveTab(tab);
		}
	};

	return (
		<div className="relative">
			<div className="w-full">
				<div className="flex justify-center">
					<div className="w-80 ring-1 ring-black ring-opacity-20 bg-white mb-3">
						<div className="flex flex-row w-0 min-w-full">
							<ul className="list-none grid col-span-4 grid-flow-col place-items-center overflow-x-auto w-0 min-w-full -mb-10 pb-10">
								<li
									className={`text-center  cursor-pointer ${
										activeTab === SIZE_TAB
											? 'border-b-2 border-solid border-gray-700'
											: ''
									}`}
								>
									<a
										onClick={() => {
											toggle(SIZE_TAB);
										}}
										href="#"
										className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-4 md:px-6 lg:px-8 block"
									>
										Theo size
										<Ripple color="black" />
									</a>
								</li>
								<li
									className={`text-center cursor-pointer ${
										activeTab === PLACEMENT_TAB
											? 'border-b-2 border-solid border-gray-700'
											: ''
									}`}
								>
									<a
										onClick={() => {
											toggle(PLACEMENT_TAB);
										}}
										href="#"
										className="relative text-gray-900 dark:text-white hover:text-indigo py-3 px-2 sm:px-4 md:px-6 lg:px-8 block"
									>
										Theo vị trí xăm
										<Ripple color="black" />
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<Card>
					<CardBody>
						{
							// Bảng giá theo size
							activeTab === SIZE_TAB && (
								<div className="pt-1" key={key}>
									<h2 className="text-lg font-semibold pb-3 text-center">
										Bảng giá dịch vụ theo kích thước
									</h2>
									<div className="relative overflow-y-auto shadow-md sm:rounded-lg">
										<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
											<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
												<tr>
													<th
														scope="col"
														className="w-24 lg:w-40 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Size
													</th>
													<th
														scope="col"
														className="w-32 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Độ khó
													</th>
													<th
														scope="col"
														className="w-32 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Màu sắc
													</th>
													<th
														scope="col"
														className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Giá
													</th>
													<th
														scope="col"
														className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Chọn
													</th>
												</tr>
											</thead>
											<tbody>
												{[...sizeMap].map(([key, value], index) => (
													<tr
														key={key}
														className={`border-b border-gray-200 dark:border-gray-700 ${
															getColor(key) ? 'bg-blue-50' : ''
														}`}
													>
														{key % 10 === 0 && (
															<th
																rowSpan={4}
																scope="row"
																className="bg-gray-50 px-3 py-2 text-base font-medium text-gray-900 dark:text-white dark:bg-gray-800"
															>
																{sizeList.at(getSize(key))}
															</th>
														)}
														{key % 5 === 0 && (
															<td rowSpan={2} className="px-3 py-2 text-base">
																{getDifficult(key) ? 'Phức tạp' : 'Đơn giản'}
															</td>
														)}
														<td
															className={`px-3 py-2 text-base ${
																getColor(key) ? 'bg-blue-50 h-full' : ''
															}`}
														>
															{getColor(key) ? 'Màu sắc' : 'Trắng đen'}
														</td>
														<td
															className={`px-3 py-2 flex justify-center ${
																getColor(key) ? 'bg-blue-50 h-full' : ''
															}`}
														>
															<div className="flex gap-2 items-center">
																<span className="text-base">Từ</span>
																<div className="w-32">
																	<MoneyInput
																		disabled={true}
																		value={value.minPrice}
																	/>
																</div>
																<span className="text-base">tới</span>
																<div className="w-32">
																	<MoneyInput
																		disabled={true}
																		value={value.maxPrice}
																	/>
																</div>
															</div>
														</td>
														<td
															className={`${
																getColor(key) ? 'bg-blue-50 h-full' : ''
															}`}
														>
															<div className="w-min mx-auto">
																<input
																	key={selectedServices.has(key)}
																	checked={selectedServices.has(key)}
																	onChange={() => handleSelectService(key)}
																	type="checkbox"
																/>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)
						}
						{
							// Bảng giá theo vị trí xăm
							activeTab === PLACEMENT_TAB && (
								<div className="pt-1">
									<h2 className="text-lg font-semibold pb-3 text-center">
										Bảng giá dịch vụ theo vị trí xăm
									</h2>
									<div className="relative overflow-y-auto shadow-md sm:rounded-lg">
										<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
											<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
												<tr>
													<th
														scope="col"
														className="w-24 lg:w-40 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Vị trí xăm
													</th>
													<th
														scope="col"
														className="w-32 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Độ khó
													</th>
													<th
														scope="col"
														className="w-32 px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Màu sắc
													</th>
													<th
														scope="col"
														className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Giá
													</th>
													<th
														scope="col"
														className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-center"
													>
														Chọn
													</th>
												</tr>
											</thead>
											<tbody>
												{[...placementMap].map(([key, value], index) => (
													<tr
														key={key}
														className={`border-b border-gray-200 dark:border-gray-700 ${
															getColor(key) ? 'bg-blue-50' : ''
														}`}
													>
														{key % 10 === 0 && Math.round(key / 100) > 0 && (
															<th
																rowSpan={4}
																scope="row"
																className="bg-gray-50 px-3 py-2 text-base font-medium text-gray-900 dark:text-white dark:bg-gray-800"
															>
																{stringServicePlacement.at(getPlacement(key))}
															</th>
														)}
														{key % 5 === 0 && (
															<td rowSpan={2} className="px-3 py-2 text-base">
																{getDifficult(key) ? 'Phức tạp' : 'Đơn giản'}
															</td>
														)}
														<td
															className={`px-3 py-2 text-base `}
														>
															{getColor(key) ? 'Màu sắc' : 'Trắng đen'}
														</td>
														<td
															className={`px-3 py-2 flex justify-center`}
														>
															<div className="flex gap-2 items-center">
																<span className="text-base">Từ</span>
																<div className="w-32">
																	<MoneyInput
																		disabled={true}
																		value={value.minPrice}
																	/>
																</div>
																<span className="text-base">tới</span>
																<div className="w-32">
																	<MoneyInput
																		disabled={true}
																		value={value.maxPrice}
																	/>
																</div>
															</div>
														</td>
														<td
															className={`${
																getColor(key) ? 'bg-blue-50 h-full' : ''
															}`}
														>
															<div className="w-min mx-auto">
																<input
																	key={selectedServices.has(key)}
																	checked={selectedServices.has(key)}
																	onChange={() => handleSelectService(key)}
																	type="checkbox"
																/>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							)
						}
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

ServicePage.propTypes = {
	services: PropTypes.array.isRequired,
	onChange: PropTypes.func
};

export default ServicePage;
