import Button from './Button';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import Router from 'next/router';

const BookingModal = ({
	children,
	redirectUrl = '/',
	onSubmit,
	canConfirm = true
}) => {
	const handleRedirect = () => {
		Router.replace(redirectUrl);
	};
	return (
		<Modal size={'7xl'} position={'center'} show={true}>
			<Modal.Body>{children}</Modal.Body>
			<Modal.Footer>
				<Button outline onClick={handleRedirect}>
					Trở về
				</Button>
				{canConfirm && <Button onClick={onSubmit}>Xác nhận</Button>}
			</Modal.Footer>
		</Modal>
	);
};

BookingModal.propTypes = {
	children: PropTypes.node,
	redirectUrl: PropTypes.string,
	onSubmit: PropTypes.func.isRequired,
	canConfirm: PropTypes.bool
};

export default BookingModal;
