import { useCallback, useState, useRef, useEffect } from 'react';

export const useFiltersModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentFilter, setCurrentFilter] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [modalPlacement, setModalPlacement] = useState('bottom');
    const modalRef = useRef(null);

    const calculateModalPosition = useCallback((rect, event) => {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const modalWidth = 400;
        const modalHeight = 500;

        const clickX = event ? event.clientX : rect.left + rect.width / 2;
        const clickY = event ? event.clientY : rect.bottom;

        let top = clickY + 5;
        let left = clickX;
        let position = 'bottom';

        if (top + modalHeight > viewportHeight - 20) {
            top = rect.top - modalHeight + modalHeight / 3;
            position = 'top';
        }

        if (left + modalWidth / 2 > viewportWidth) {
            left = viewportWidth - modalWidth / 2;
        }
        if (left - modalWidth / 2 < 0) {
            left = modalWidth / 2;
        }

        return {
            position: position,
            top: top,
            left: left
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const openModal = useCallback((type, filter = null, positionData = null) => {
        setModalType(type);
        setCurrentFilter(filter);
        if (positionData) {
            setModalPosition({
                top: positionData.top,
                left: positionData.left
            });
            setModalPlacement(positionData.position);
        }
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentFilter(null);
    }, []);

    return {
        isModalOpen,
        modalType,
        currentFilter,
        modalPosition,
        modalPlacement,
        modalRef,
        calculateModalPosition,
        openModal,
        closeModal
    };
};