import Button from './Button';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';

const MyModal = ({
	title,
	children,
	confirmTitle = 'Xác nhận',
	cancelTitle = 'Huỷ',
	warn = false,
	openModal,
	setOpenModal,
  onSubmit
}) => {
	return (
		<>
			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>{title}</Modal.Header>
				<Modal.Body>{children}</Modal.Body>
				<Modal.Footer>
					<Button outline onClick={() => setOpenModal(false)}>{cancelTitle}</Button>
					<Button warn={warn} onClick={onSubmit}>
						{confirmTitle}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

MyModal.propTypes = {
	title: PropTypes.string.isRequired,
	children: PropTypes.node,
	confirmTitle: PropTypes.string,
	cancelTitle: PropTypes.string,
	warn: PropTypes.bool,
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default MyModal;
