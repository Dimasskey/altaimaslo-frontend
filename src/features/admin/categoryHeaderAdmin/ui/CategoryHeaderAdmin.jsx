import React, { useState, useRef, useEffect} from 'react';
import "./categoryHeaderAdminStyles.css"
import FilterIcon from '@shared/imges/svg/filterSvg.svg?react'
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import {SORT_METHODS} from "@shared/utils/testData/sortMethods";
import FilterSidebar from "@/widgets/categoryPage/filterSidebar/ui/FilterSidebar";
import ArrowBack from "@shared/imges/svg/arrowBack.svg?react";

const CategoryHeaderAdmin = ({
                                 categoryTitle = "Новинки",
                                 count,
                                 filters,
                                 onFilterChange,
                                 onClearFilters,
                                 selectedFilters,
                                 onSortChange,
                                 onClick = null,
                             }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const filterRef = useRef(null);

    function toggleFilters() {
        setIsFiltersOpen(!isFiltersOpen);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (isFiltersOpen && filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFiltersOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFiltersOpen]);

    const titleLines = categoryTitle ? categoryTitle.split('\n') : [];

    return (
        <div className="categories-header-admin">
            <div className="categories-header-admin__wrapper">
                <div className="categories-header-admin__left">
                    <div className="categories-header-admin__top">
                        {onClick && <ArrowBack onClick={onClick}/>}
                        <div className="categories-header-admin__title">
                            {titleLines.length > 1 ? (
                                titleLines.map((line, index) => (
                                    <div key={index} className="categories-header-admin__title-line">
                                        {line}
                                    </div>
                                ))
                            ) : (
                                categoryTitle
                            )}
                        </div>
                        <span className="categories-header-admin__count">{count} товаров</span>
                    </div>
                    <div className={"categories-header-admin__bottom"}>
                        Сортировка:
                        <CustomSelect
                            items={SORT_METHODS}
                            className="categories-header-admin__select"
                            onChange={(value) => {
                                onSortChange(value);
                            }}
                        />
                    </div>
                </div>

                <div className="categories-header-admin__filter" ref={filterRef}>
                    <span className="categories-header-admin__filter-title">Фильтры</span>
                    <FilterIcon
                        className={`categories-header-admin__filter-icon ${isFiltersOpen ? "active-filterAdmin" : ""}`}
                        onClick={toggleFilters}
                    />
                    <div className={`categories-header-admin__filter-sidebar ${isFiltersOpen ? "categories-header-admin__filter-sidebar--open" : ""}`}>
                        <FilterSidebar
                            filters={filters}
                            onFilterChange={onFilterChange}
                            onClearFilters={onClearFilters}
                            selectedFilters={selectedFilters}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryHeaderAdmin;