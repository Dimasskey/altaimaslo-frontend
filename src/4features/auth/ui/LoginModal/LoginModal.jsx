import React from 'react';
import LoginForm from "@/4features/auth/ui/LoginForm/LoginForm";
import Modal from "@shared/ui/Modal/Modal";

const LoginModal = ({isOpen, onClose, setModalClass, resetModalClass, modalClass}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            modalType={`login-modal ${modalClass}`}
        >
            <LoginForm
                closeModal={onClose}
                setModalClass={setModalClass}
                resetModalState={resetModalClass}
            />
        </Modal>
    );
};

export default LoginModal;