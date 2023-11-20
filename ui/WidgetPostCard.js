import { Card } from './Card';

import { BackgroundImg } from './BackgroundImg';
import PropTypes from 'prop-types';
import Link from 'next/link';

export const WidgetPostCard = ({ children, image, imageHeight, link = '#' }) => {
	return (
		<Card>
			<Link href={link}>
				<div className="relative w-full">
					<BackgroundImg
						className="relative w-full bg-center bg-cover bg-fallback"
						image={image}
						height={imageHeight}
					/>
				</div>
			</Link>

			<div className={'p-2 bg-white'}>{children}</div>
		</Card>
	);
};

WidgetPostCard.propTypes = {
	link: PropTypes.string,
	children: PropTypes.node.isRequired,
	image: PropTypes.string.isRequired,
	imageHeight: PropTypes.number.isRequired
};
