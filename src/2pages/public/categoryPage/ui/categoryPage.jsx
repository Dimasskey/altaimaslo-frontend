import React, { useState} from 'react';
import TopLink from "@/3widgets/topLink/TopLink";
import Header from "@/3widgets/header/ui/Header";
import FilterSidebar from "@/3widgets/categoryPage/filterSidebar/ui/FilterSidebar";
import CategoriesHeader from "@/3widgets/categoryPage/categoriesHeader/ui/CategoriesHeader";
import ProductList from "@/3widgets/categoryPage/productList/ProductList";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useSearchParams} from "react-router-dom";
import {useSearchGoods} from "@shared/hooks/useSearchGoods/useSearchGoods";
import {useFilters} from "@shared/hooks/useFilters/useFilters";

const CategoryPage = () => {
    const [searchParams] = useSearchParams();
    const categoriesId = searchParams.get("categories_id");
    const searchText = searchParams.get("text");

    const categoryName = decodeURIComponent(searchParams.get('name') || '')
    const [order, setOrder] = useState('')

    const {selectedFilters, handleFilterChange, clearFilters, filters, loading: filtersLoading} = useFilters(categoriesId, searchText)

    const {goods, count, loading, loadingMore, loadMore}
        = useSearchGoods(categoriesId, searchText, selectedFilters, order);

    const isMobile = useIsMobile()


    return (
        <div>
            {/*{!isMobile &&  <TopLink />}*/}
            {/*<Header></Header>*/}
            <div className="categories-content">
                {!isMobile ? <FilterSidebar
                    filters={filters}
                    loading={filtersLoading}
                    onFilterChange={handleFilterChange}
                    selectedFilters = {selectedFilters}
                    onClearFilters = {clearFilters}

                /> : null}
                <div className={`categories-main`}>
                    <CategoriesHeader
                        productCount={count}
                        searchText={searchText}
                        onChangeOrder = {setOrder}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        selectedFilters = {selectedFilters}
                        onClearFilters = {clearFilters}
                        categoryName = {categoryName}
                    />
                    <ProductList products={goods} loading={loading} loadingMore={loadingMore} onLoadMore={loadMore} />
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;