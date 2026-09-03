import React, {useState} from 'react';

import "./categoriesHeader.scss"
import FilterIcon from '@shared/imges/svg/filterSvg.svg?react'

import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import {SORT_METHODS} from "@shared/utils/testData/sortMethods";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import MobileSideDrawer from "@shared/ui/MobileSideDrawer/MobileSideDrawer";
import FilterSidebar from "@/3widgets/categoryPage/filterSidebar/ui/FilterSidebar";
import {useCategories} from "@/4features/mainPage/categoryMainPage/model/useCategories";
import {useAuth} from "@/1app/providers/authProvider/authProvider";




const CategoriesHeader = ({productCount, searchText, onChangeOrder, filters, onClearFilters, onFilterChange, selectedFilters, categoryName}) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const isMobile = useIsMobile()
    const {user} = useAuth()

    const isAuth = !!user

    const title = searchText
        ? `Поиск по "${searchText}"`
        : categoryName


    return (
        <div className={'categories-header'}>
            <div className={'categories-header-top'}>
                <div className={'categories-header-top-name'}>
                    <div className={'categories-header__title'}>{title}</div>
                    <span className={'categories-header__count'}>{productCount} товаров</span>
                </div>
                {isMobile && filters.length > 0 && (
                    <div className={'categories-header-filter mobile'} onClick={() => setIsFiltersOpen(true)}>
                        <span className={'categories-header-filter__title'}>Фильтры</span>
                        <FilterIcon className={'categories-header-filter__icon'}/>
                    </div>
                )}
            </div>
            {isAuth && (
                <div className={'categories-header__select'}>
                    {!isMobile ? 'Сортировать:' : ''}
                    <CustomSelect
                        items={SORT_METHODS}
                        onChange={onChangeOrder}
                    />
                </div>
            )}

            <MobileSideDrawer side={'right'} isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
                <FilterSidebar
                    filters={filters}
                    onFilterChange={onFilterChange}
                    selectedFilters = {selectedFilters}
                    onClearFilters = {onClearFilters}
                />
            </MobileSideDrawer>
        </div>


    );
};

export default CategoriesHeader;