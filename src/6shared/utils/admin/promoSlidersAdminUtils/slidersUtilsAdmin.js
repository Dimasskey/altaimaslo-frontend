import { useCallback, useState, useRef, useEffect } from 'react';
import {
    PointerSensor,
    KeyboardSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

// Общие сенсоры для drag & drop
export const useSliderSensors = () => {
    return useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
};

export const useSliderModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentSlider, setCurrentSlider] = useState(null);
    const [currentSliderIndex, setCurrentSliderIndex] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [modalPlacement, setModalPlacement] = useState('bottom');
    const modalRef = useRef(null);

    const calculateModalPosition = useCallback((rect, event) => {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const modalWidth = 400;
        const modalHeight = 370;

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

    const openModal = useCallback((type, slider = null, index = null, positionData = null) => {
        setModalType(type);
        setCurrentSlider(slider);
        setCurrentSliderIndex(index);
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
        setCurrentSlider(null);
        setCurrentSliderIndex(null);
    }, []);

    return {
        isModalOpen,
        modalType,
        currentSlider,
        currentSliderIndex,
        modalPosition,
        modalPlacement,
        modalRef,
        calculateModalPosition,
        openModal,
        closeModal
    };
};

export const handleSliderDragEnd = (event, sliders, mainSliderIndex, onUpdateOrder, onMainSliderIndexChange) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
        const oldIndex = sliders.findIndex((item) => item.id === active.id);
        const newIndex = sliders.findIndex((item) => item.id === over.id);

        const newSliders = arrayMove(sliders, oldIndex, newIndex);

        const updatedSliders = newSliders.map((slider, index) => ({
            ...slider,
            order_number: index
        }));

        if (mainSliderIndex === oldIndex) {
            onMainSliderIndexChange(newIndex);
        } else if (mainSliderIndex === newIndex) {
            onMainSliderIndexChange(oldIndex);
        }

        onUpdateOrder(updatedSliders);
    }
};