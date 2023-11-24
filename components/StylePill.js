import PropTypes from 'prop-types';
const StylePill = ({ children }) => {
	return (
		<div className="px-2 pb-0.5 bg-gray-700 text-white rounded-2xl shadow-2xl cursor-pointer">
			{children}
		</div>
	);
};

StylePill.propTypes = {
	children: PropTypes.node
};

export default StylePill;
