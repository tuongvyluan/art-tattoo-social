import { Ripple } from 'ui';
import PropTypes from 'prop-types';

const Button = ({ children }) => {
	return (
		<button className="relative inline-flex justify-center border-t border-b ltr:border-r rtl:border-l border-white px-4 py-3 bg-white font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none">
			{children}
			<Ripple />
		</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired
};

export default Button;
