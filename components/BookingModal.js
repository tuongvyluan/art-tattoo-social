import Button from './Button';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import Router from 'next/router';

const BookingModal = ({
	children,
	redirectUrl = '/',
	onSubmit,
	canConfirm = true,
	cancelTitle = 'Trở về',
	confirmTitle = 'Xác nhận',
	size = '7xl'
}) => {
	const handleRedirect = () => {
		Router.replace(redirectUrl);
	};
	return (
		<Modal size={size} position={'center'} show={true}>
			<Modal.Body>{children}</Modal.Body>
			<Modal.Footer>
				<div className="flex flex-wrap items-center justify-center gap-3 w-full">
					<div>
						<Button outline onClick={handleRedirect}>
							{cancelTitle}
						</Button>
					</div>
					{canConfirm && (
						<div>
							<Button onClick={onSubmit}>{confirmTitle}</Button>
						</div>
					)}
				</div>
			</Modal.Footer>
		</Modal>
	);
};

BookingModal.propTypes = {
	children: PropTypes.node,
	redirectUrl: PropTypes.string,
	onSubmit: PropTypes.func.isRequired,
	canConfirm: PropTypes.bool,
	cancelTitle: PropTypes.string,
	confirmTitle: PropTypes.string,
	size: PropTypes.string
};

export default BookingModal;
