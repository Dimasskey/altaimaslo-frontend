import { useState } from 'react';

export const useLoginModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalClass, setModalClass] = useState('');

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setModalClass('');
    };

    const resetModalState = () => setModalClass('');

    return {
        isOpen,
        modalClass,
        openModal,
        closeModal,
        setModalClass,
        resetModalState
    };
};