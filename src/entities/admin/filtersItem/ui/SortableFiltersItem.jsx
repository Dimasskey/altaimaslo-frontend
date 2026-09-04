import React, { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import "./filtersAdminItemStyles.scss"
import DragHandle from "@shared/imges/svg/dragnDrop.svg?react";

const SortableFiltersItem = React.memo(({
                                            item,
                                            index,
                                            onDelete,
                                            onEdit,
                                            onClick,
                                            showDeleteButton = false,
                                            isDragEnabled = true,
                                        }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.id,
        disabled: !isDragEnabled,
        transition: {
            duration: 150,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        }
    });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : (isDragEnabled ? 'grab' : 'pointer'),
    };

    const handleClick = useCallback((event) => {
        if (isDragging) {
            event.preventDefault();
            return;
        }

        if (onClick) {
            onClick(item);
            return;
        }

        if (onEdit) {
            onEdit(item, event.currentTarget, event);
        }
    }, [item, onEdit, onClick, isDragging]);

    const handleDeleteClick = useCallback((event) => {
        event.stopPropagation();
        if (onDelete) {
            onDelete(item.id, item.name);
        }
    }, [item, onDelete]);

    const handleDragStart = useCallback((event) => {
        if (isDragEnabled) {
            listeners.onMouseDown?.(event);
            listeners.onTouchStart?.(event);
        }
    }, [listeners, isDragEnabled]);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className={`filters-admin-item ${isDragging ? 'dragging' : ''}`}
                onClick={handleClick}
                {...(isDragEnabled ? {} : attributes)}
            >
                {isDragEnabled ? (
                    <div
                        className="filters-admin-item__drag-indicator"
                        title="Перетащите для изменения порядка"
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        {...(isDragEnabled ? listeners : {})}
                    >
                        <DragHandle />
                    </div>
                ) : (
                    <div className="filters-admin-item__placeholder">
                    </div>
                )}
                <div className="filters-admin-item__name">
                    {item.name}
                </div>
                <div className="filters-admin-item__buttons">
                    {showDeleteButton && onDelete && (
                        <span
                            className="filters-admin-item__delete"
                            onClick={handleDeleteClick}
                            aria-label="Удалить фильтр"
                            title="Удалить фильтр"
                        >
                        +
                    </span>
                    )}
                </div>
            </div>
        </>
    );
});

export default SortableFiltersItem;