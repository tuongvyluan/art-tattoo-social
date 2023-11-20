import { Card } from './Card';

import { BackgroundImg } from './BackgroundImg';
import PropTypes from 'prop-types';

export const WidgetPostCard = ({ children, image, imageHeight }) => {
	return (
		<Card>
			<div className="relative w-full">
				<BackgroundImg
					className="relative w-full bg-center bg-cover bg-fallback"
					image={image}
					height={imageHeight}
				/>
			</div>

			<div className={'p-2 bg-white'}>{children}</div>
		</Card>
	);
};

WidgetPostCard.propTypes = {
	children: PropTypes.node.isRequired,
	image: PropTypes.string.isRequired,
	imageHeight: PropTypes.number.isRequired
};
