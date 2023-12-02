import PropTypes from 'prop-types'
import {
	stringPlacements,
	stringSize
} from 'lib/status';
import { formatPrice } from 'lib';

const CustomerServices = ({ services }) => {
	return (
		<div className="">
			<div className="block">
				{services?.map((service, serviceIndex) => (
					<div key={service.id}>
						<div className="flex justify-between items-center w-full">
							<div key={service.id} className="pb-1 flex flex-wrap text-base">
								<div>{serviceIndex + 1}</div>
								<div className="pr-1">. {service.title},</div>

								<div className="pr-1">{stringSize.at(service.size)},</div>

								{service.placement ? (
									<div className="pr-1">
										Vị trí xăm: {stringPlacements.at(service.placement)},
									</div>
								) : (
									<></>
								)}

								<div className="pr-1">
									{formatPrice(service.minPrice)} - {formatPrice(service.maxPrice)}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

CustomerServices.propTypes = {
  services: PropTypes.array
}

export default CustomerServices