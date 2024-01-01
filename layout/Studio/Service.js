import Button from 'components/Button';
import { extractServiceName, formatPrice } from 'lib';
import { stringPlacements, stringServiceCategories, stringSize } from 'lib/status';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Alert, Card, CardBody } from 'ui';
import { v4 } from 'uuid';

function ServicePage({ services, onChange }) {
	const [serviceList, setServiceList] = useState(services);
	const [showAlert, setShowAlert] = useState(false);

	const [alertContent, setAlertContent] = useState({
		title: '',
		content: '',
		isWarn: 'blue'
	});

	const onSelectService = (index) => {
		const services = [...serviceList];
		services[index]['quantity'] = services[index]['quantity'] + 1;
		const service = services[index];
		setServiceList(services);
		onChange(true, service);
	};

	useEffect(() => {
		setServiceList(services);
	}, [services]);

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
					<div>
						<div className="pt-1">
							<h2 className="text-lg font-semibold pb-3 text-center">
								Bảng giá dịch vụ
							</h2>
							<div className="relative shadow-md sm:rounded-lg min-w-max w-full overflow-auto flex justify-center">
								<table className="w-full text-sm text-left text-gray-500 pb-20">
									<thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
										<tr>
											<th
												scope="col"
												className="w-1/3 sm:px-3 sm:py-3 bg-gray-50 text-center"
											>
												Tên dịch vụ
											</th>
											<th
												scope="col"
												className="sm:px-3 sm:py-3 bg-gray-50 text-center"
											>
												Loại dịch vụ
											</th>
											<th
												scope="col"
												className="sm:px-3 sm:py-3 bg-gray-50 text-center"
											>
												Giá
											</th>
											<th
												scope="col"
												className="sm:px-3 sm:py-3 bg-gray-50 text-center"
											></th>
										</tr>
									</thead>
									<tbody className="h-full">
										{serviceList.map((service, serviceIndex) => (
											<tr
												key={service.id}
												className="bg-white border-b hover:bg-gray-50 text-black"
											>
												<td className="sm:px-3 sm:py-4">
													<div className="text-base p-1">
														{extractServiceName(service)}
													</div>
												</td>
												<td className="sm:px-3 sm:py-4 text-base">
													{stringServiceCategories.at(service.serviceCategoryId)}
												</td>
												<td className="sm:px-3 sm:py-4">
													{service.maxPrice === 0 ? (
														<div className='text-base '>Miễn phí</div>
													) : (
														<div className="text-base flex flex-wrap min-w-max mx-auto gap-2 items-center">
															<div>{formatPrice(service.minPrice)}</div>
															<span>tới</span>
															<div>{formatPrice(service.maxPrice)}</div>
														</div>
													)}
												</td>
												<td className="sm:px-3 sm:py-4 flex flex-col justify-center">
													<div className="w-20">
														<div className="flex">
															<Button
																key={`${service.quantity}${service.id}`}
																reset={true}
																onClick={() => onSelectService(serviceIndex)}
															>
																Chọn{' '}
																{service.quantity > 0 && `(${service.quantity})`}
															</Button>
														</div>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
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
