import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import { CSS } from '@dnd-kit/utilities';

const SortableSliderItem = React.memo(({ 
    slider, 
    index, 
    isActive, 
    onClick,
    imageField,
    altText 
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable({ id: slider.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: isDragging ? 'none' : 'transform 0.15s ease',
    };

    const handleClick = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(slider, index, e.currentTarget, e.nativeEvent);
    }, [slider, index, onClick]);

    const handleImageError = useCallback((e) => {
        e.target.style.display = 'none';
        if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
        }
    }, []);

    const hasImage = slider[imageField] && slider[imageField] !== '00000000-0000-0000-0000-000000000000';

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`sliders-list-item ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
        >
            {hasImage ? (
                <img
                    src={getAttachmentUrl(slider[imageField])}
                    className="slider-thumbnail"
                    onClick={handleClick}
                    onError={handleImageError}
                    alt={altText}
                    loading="lazy"
                />
            ) : (
                <div
                    className="slider-placeholder"
                    onClick={handleClick}
                >
                    Нет изображения
                </div>
            )}
        </div>
    );
});

export default SortableSliderItem;