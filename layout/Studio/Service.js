import { formatPrice } from 'lib';
import { stringPlacements, stringSize } from 'lib/status';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Alert, Card, CardBody } from 'ui';

function ServicePage({ services, onChange }) {
	const [serviceList, setServiceList] = useState(services);

	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: false
	});

	const handleAlert = (state, title, content, isWarn = false) => {
		setShowAlert((prev) => state);
		setAlertContent({
			title: title,
			content: content,
			isWarn: isWarn
		});
	};

	const onSelectService = (index, quantity) => {
		const services = [...serviceList];
		const isIncrease = Number.parseInt(quantity) > services[index]['quantity']
		services[index]['quantity'] = Number.parseInt(quantity);
		const service = services[index]
		setServiceList(services);
		onChange(isIncrease, service);
	};

	return (
		<div className="relative">
			<Alert
				showAlert={showAlert}
				setShowAlert={setShowAlert}
				color={alertContent.isWarn ? 'red' : 'blue'}
				className="bottom-2 right-2 fixed max-w-md z-50"
			>
				<strong className="font-bold mr-1">{alertContent.title}</strong>
				<span className="block sm:inline">{alertContent.content}</span>
			</Alert>
			<div className="sm:px-3 md:px-1 lg:px-10 xl:px-12">
				<Card>
					<CardBody>
						<div className="pt-1">
							<h2 className="text-lg font-semibold pb-3 text-center">
								Bảng giá dịch vụ
							</h2>
							<div className="relative shadow-md sm:rounded-lg">
								<table className="w-full text-sm text-left text-gray-500 pb-20">
									<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
										<tr>
											<th
												scope="col"
												className="w-1/3 px-3 py-3 bg-gray-50 text-center"
											>
												Tên dịch vụ
											</th>
											<th scope="col" className="px-3 py-3 bg-gray-50 text-center">
												Giá
											</th>
											<th
												scope="col"
												className="px-3 py-3 bg-gray-50 text-center"
											></th>
										</tr>
									</thead>
									<tbody className="h-full">
										{serviceList.map((service, serviceIndex) => (
											<tr
												key={service.id}
												className="bg-white border-b hover:bg-gray-50 text-black"
											>
												<td className="px-3 py-4">
													<div className="text-base p-1">
														{service.title}, {stringSize.at(service.size)}{', '}
														{stringPlacements.at(service.placement)}
													</div>
												</td>
												<td className="px-3 py-4">
													<div className="text-base flex flex-wrap max-w-max mx-auto gap-2 items-center">
														<div>{formatPrice(service.minPrice)}</div>
														<span>tới</span>
														<div>{formatPrice(service.maxPrice)}</div>
													</div>
												</td>
												<td className="px-3 py-4 flex flex-wrap gap-2">
													<div className='w-20'>
														<input
															type="number"
															className="text-base text-black flex flex-row items-center rounded-lg py-0.5 pr-2 border border-gray-300 pl-5 w-full"
															step={1}
															min={0}
															value={service.quantity}
															onChange={(e) =>
																onSelectService(serviceIndex, e.target.value)
															}
														/>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
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
