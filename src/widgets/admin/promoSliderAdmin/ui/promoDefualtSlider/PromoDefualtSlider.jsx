import React, { useCallback } from 'react';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import "./promoDefualtSliderStyles.scss"
import AddSliderItem from "@/entities/admin/addSliderItem/AddSliderItem";
import PlusImg from "@shared/imges/svg/plusImg.svg?react";
import { useSliderSensors, useSliderModal, handleSliderDragEnd } from '@shared/utils/admin/promoSlidersAdminUtils/slidersUtilsAdmin';
import SortableSliderItem from '@shared/utils/admin/promoSlidersAdminUtils/sortableSlidersItem';

const PromoDefualtSlider = React.memo(({
                                           sliders = [],
                                           loading,
                                           mainSliderIndex,
                                           onMainSliderIndexChange,
                                           onUpdateOrder,
                                           onAddSlider,
                                           onUpdateSlider,
                                           onDeleteSlider
                                       }) => {
    const sensors = useSliderSensors();
    const {
        isModalOpen,
        modalType,
        currentSlider,
        modalPosition,
        modalPlacement,
        modalRef,
        calculateModalPosition,
        openModal,
        closeModal
    } = useSliderModal();

    const handleDragEnd = useCallback((event) => {
        handleSliderDragEnd(event, sliders, mainSliderIndex, onUpdateOrder, onMainSliderIndexChange);
    }, [sliders, mainSliderIndex, onUpdateOrder, onMainSliderIndexChange]);

    const handleSliderClick = useCallback((slider, index, element, event) => {
        const rect = element.getBoundingClientRect();
        const positionData = calculateModalPosition(rect, event);
        openModal('edit', slider, index, positionData);
    }, [calculateModalPosition, openModal]);

    const handleAddButtonClick = useCallback((event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const positionData = calculateModalPosition(rect, event.nativeEvent);
        openModal('add', null, null, positionData);
    }, [calculateModalPosition, openModal]);

    const handleSaveSlider = useCallback((sliderData) => {
        if (modalType === 'add') {
            onAddSlider(sliderData);
        } else if (modalType === 'edit' && currentSlider) {
            onUpdateSlider(currentSlider.id, sliderData);
        }
        closeModal();
    }, [modalType, currentSlider, onAddSlider, onUpdateSlider, closeModal]);

    const handleDeleteSlider = useCallback((sliderId) => {
        if (onDeleteSlider) {
            onDeleteSlider(sliderId);
            closeModal();
        }
    }, [onDeleteSlider, closeModal]);

    return (
        <div className={`sliders-wrapper ${loading ? 'loading' : 'loaded'}`}
             style={{minHeight: '5vh'}}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={rectIntersection}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sliders.map(slider => slider.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    <div className={"sliders-list"}>
                        <div
                            className={"sliders-list-item add-slider-btn"}
                            onClick={handleAddButtonClick}
                            title="Добавить новый слайд"
                        >
                            <PlusImg/>
                        </div>
                        {sliders.map((slider, index) => (
                            <SortableSliderItem
                                key={slider.id}
                                slider={slider}
                                index={index}
                                isActive={index === mainSliderIndex}
                                onClick={handleSliderClick}
                                imageField="attachment_guid_is_pc"
                                altText={`Слайд ${index + 1}`}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {isModalOpen && (
                <div className="add-slider-modal-overlay">
                    <div
                        ref={modalRef}
                        className="add-slider-modal-container"
                        style={{
                            position: 'absolute',
                            top: modalPosition.top,
                            left: modalPosition.left,
                            transform: 'translateX(-50%)'
                        }}
                    >
                        <AddSliderItem
                            onClose={closeModal}
                            onSave={handleSaveSlider}
                            onDelete={handleDeleteSlider}
                            type="pc"
                            mode={modalType}
                            slider={currentSlider}
                            position={modalPlacement}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default PromoDefualtSlider;