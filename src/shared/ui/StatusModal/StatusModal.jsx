import React from 'react';
import Modal from "@shared/ui/Modal/Modal";

import "./statusModal.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";

const StatusModal = ({
    isOpen,
    onClose,
    type = '',
    title = '',
    message = '',
    image = null,
    onConfirm,
    onCancel,
    onCloseCallback,
    confirmText = 'Да',
    cancelText = 'Нет',
    showConfirm = false,
    showCancel = false,
    showClose = true,
                     }) => {

    const handleConfirm = async () => {
        if (onConfirm) {
           await onConfirm()
        }
        await onClose()
    }

    const handleCancel = async () => {
        if (onCancel) {
           await onCancel()
        }
        await onClose()
    }

    const handleClose = async () => {
        if (onCloseCallback) {
           await onCloseCallback()
        }
        await onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            modalType={`status-modal status-modal--${type}`}
            showCloseButton={false}
        >
            <div className={`status-content`}>

                {image && (
                    <div className="status-image">
                        <img src={image} />
                    </div>
                )}

                {title && <span className='status-title'>{title}</span>}
                {message && <span className='status-message'>{message}</span>}

                <div className={'status-actions'}>
                    {showConfirm && (
                        <ButtonDefault
                            classButton={'status-actions__confirm'}
                            onClick={handleConfirm}
                            text={confirmText}
                        />
                    )}


                    {showCancel && (
                        <ButtonDefault
                            classButton={'status-actions__cancel'}
                            onClick={handleCancel}
                            text={cancelText}
                        />
                    )}


                    {!showCancel && !showConfirm && (
                        <ButtonDefault
                         classButton={'status-actions__close'}
                         onClick={handleClose}
                         text={'Закрыть'}
                        />
                    )}
                </div>


            </div>
        </Modal>
    );
};

export default StatusModal;