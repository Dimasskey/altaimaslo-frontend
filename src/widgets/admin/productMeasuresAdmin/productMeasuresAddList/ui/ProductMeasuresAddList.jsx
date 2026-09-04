import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import SearchAdmin from "@shared/ui/SearchAdmin/SearchAdmin";
import SortableFiltersItem from "@/entities/admin/filtersItem/ui/SortableFiltersItem";
import { useFetchFiltersAdmin } from '@/widgets/admin/filtersAdmin/lib/useFetchFiltersAdmin';
import "./productMeasuresAddListStyles.scss";

const ProductMeasuresAddList = ({
                                    onAddMeasure,
                                    existingMeasures = [],
                                    buttonRef,
                                    onClose,
                                    clickPosition = { x: 0, y: 0 }
                                }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [position, setPosition] = useState({ top: 400, left: 400, width: 400 });
    const containerRef = useRef(null);

    const { filters, loading } = useFetchFiltersAdmin();

    const availableFilters = useMemo(() => {
        const existingIds = existingMeasures.map(m => m.id);
        return filters.filter(filter => !existingIds.includes(filter.id));
    }, [filters, existingMeasures]);

    const filteredFilters = useMemo(() => {
        return availableFilters.filter(filter =>
            filter.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableFilters, searchTerm]);

    const calculateModalPosition = useCallback((buttonRect) => {
        if (!buttonRect) return { top: 400, left: 400, width: 500 };

        const modalWidth = 500;
        const modalHeight = 250;
        const offset = 10;
        const viewportMargin = 20;

        let top = buttonRect.top - modalHeight - offset;

        if (top < viewportMargin) {
            top = viewportMargin;
        }

        let left = buttonRect.left + (buttonRect.width / 2) - (modalWidth / 2);

        if (left < viewportMargin) {
            left = viewportMargin;
        } else if (left + modalWidth > window.innerWidth - viewportMargin) {
            left = window.innerWidth - modalWidth - viewportMargin;
        }

        return {
            top: Math.max(viewportMargin, top),
            left,
            width: modalWidth
        };
    }, []);

    useEffect(() => {
        if (buttonRef?.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const positionData = calculateModalPosition(rect);
            setPosition(positionData);
        }
    }, [buttonRef, calculateModalPosition]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, buttonRef]);

    const handleFilterClick = useCallback((filter) => {
        onAddMeasure(filter);
        onClose?.();
    }, [onAddMeasure, onClose]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose?.();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    if (loading) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="product-measures-add-list"
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                zIndex: 1000,
                width: `${position.width}px`
            }}
        >
            <div className="product-measures-add-list-arrow product-measures-add-list-arrow--bottom"></div>

            <div className="product-measures-add-list-content">
                <div className="filters-title">Фильтры</div>
                <div className="search-container">
                    <SearchAdmin
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Поиск фильтров..."
                        size="small"
                        autoFocus
                    />
                </div>
                <div className="filters-list">
                    {filteredFilters.length > 0 ? (
                        filteredFilters.map((filter, index) => (
                            <SortableFiltersItem
                                key={filter.id}
                                item={filter}
                                index={index}
                                onClick={handleFilterClick}
                                showDeleteButton={false}
                                isDragEnabled={false}
                            />
                        ))
                    ) : (
                        <div className="no-filters">
                            {searchTerm ? 'Фильтры не найдены' : 'Нет доступных фильтров'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductMeasuresAddList;