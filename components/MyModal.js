import Button from './Button';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import { useRef } from 'react';
import { IoIosWarning } from 'react-icons/io';

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
	const initialFocus = useRef(null);
	return (
		<Modal
			initialFocus={initialFocus}
			show={openModal}
			onClose={() => setOpenModal(false)}
		>
			<Modal.Header>
				<div className="flex flex-wrap items-center gap-2">
					{warn && <IoIosWarning size={20} className="text-red-500" />}
					<div className={`${warn ? 'text-red-500' : ''}`}>{title}</div>
				</div>
			</Modal.Header>
			<Modal.Body>{children}</Modal.Body>
			<Modal.Footer>
				<Button ref={initialFocus} outline onClick={() => setOpenModal(false)}>
					{cancelTitle}
				</Button>
				<Button warn={warn} onClick={onSubmit}>
					{confirmTitle}
				</Button>
			</Modal.Footer>
		</Modal>
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
