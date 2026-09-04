import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useSearchParams, useNavigate} from "react-router-dom";
import "./productsAdminStyles.scss"

import CategoryHeaderAdmin from "@/features/admin/categoryHeaderAdmin/ui/CategoryHeaderAdmin";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import AddProductListAdmin from "@/widgets/admin/addProuctAdminList/ui/AddProductListAdmin";
import ProductCardWithMiddleClick from "../productCardWithMiddleClick/ProductCardWithMiddleClick";
import {useFilters} from "@shared/hooks/useFilters/useFilters";
import {useInfinityScroll} from "@shared/hooks/useInfinityScroll/useInfinityScroll";
import SearchHeaderAdmin from "@/widgets/admin/productsAdmin/seacrhHeaderAdmin/ui/SearchHeaderAdmin";
import {useSearchGoodsAdmin} from "@shared/hooks/useSearchGoodsAdmin/useSearchGoodsAdmin";

const ProductsAdmin = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoriesId = searchParams.get("categories_id");
    const categoryNameFromUrl = searchParams.get("category_name");

    const [forceRenderKey, setForceRenderKey] = useState(0);

    const shouldShowOrderWrapper = useMemo(() => {
        return !!(categoriesId || categoryNameFromUrl);
    }, [categoriesId, categoryNameFromUrl]);

    const [searchText, setSearchText] = useState('');
    const [order, setOrder] = useState('');
    const [openEditProductList, setOpenEditProductList] = useState(false);

    const { selectedFilters, handleFilterChange, clearFilters } = useFilters();

    const { goods, filters, count, loadMore, loading, loadingMore, fetchGoodsDirectly } = useSearchGoodsAdmin(
        categoriesId,
        searchText,
        selectedFilters,
        order
    );

    const {sentinelRef} = useInfinityScroll(loadMore);
    const productCount = count || 0;

    const shouldShowLoadingOnBlock = loading && !loadingMore;

    const getCategoryTitle = () => {
        if (categoryNameFromUrl) {
            return decodeURIComponent(categoryNameFromUrl);
        }
        if (categoriesId) {
            return "Категория";
        }
        return "Все товары";
    };

    const openSearchEditProductList = useCallback(() => {
        setOpenEditProductList(!openEditProductList);
    }, [openEditProductList]);

    const closeSearchEditProductList = useCallback(() => {
        setOpenEditProductList(false);
        fetchGoodsDirectly();
    }, [fetchGoodsDirectly]);

    const handleEdit = useCallback((productId) => {
        const params = new URLSearchParams();
        if (categoriesId) params.append("categories_id", categoriesId);
        if (categoryNameFromUrl) params.append("category_name", categoryNameFromUrl);

        navigate(`/adminPanel/editProductAdmin/${productId}?${params.toString()}`);
    }, [navigate, categoriesId, categoryNameFromUrl]);

    const handleSearchSubmit = (searchValue) => {
        setSearchText(searchValue);
    };

    const handleOrderUpdate = useCallback(async () => {
        setForceRenderKey(prev => prev + 1);
        await fetchGoodsDirectly();
    }, [fetchGoodsDirectly]);

    useEffect(() => {
        setSearchText('');
        setOpenEditProductList(false);
        setForceRenderKey(prev => prev + 1);
    }, [categoriesId]);

    return (
        <div className={'product_admin'}>
            {!openEditProductList && (
                <>
                    <CategoryHeaderAdmin
                        categoryTitle={getCategoryTitle()}
                        productCount={productCount}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearFilters}
                        selectedFilters={selectedFilters}
                        count={count}
                        onSortChange={setOrder}
                    />

                    <div className={"product_admin-search"}>
                        <SearchHeaderAdmin
                            onSearchSubmit={handleSearchSubmit}
                            initialSearchText={searchText}
                        />
                    </div>

                    <div className={`product_admin-grid ${shouldShowLoadingOnBlock ? "loading" : "loaded"}`}>
                        {goods.length === 0 && !shouldShowLoadingOnBlock ? (
                            <div className="product_admin-none-data">
                                {searchText ? `По запросу "${searchText}" товаров не найдено` : 'Товаров не найдено'}
                                <ButtonDefault
                                    text={"добавить в категорию"}
                                    onClick={openSearchEditProductList}
                                    classButton={"search-product-admin"}
                                />
                            </div>
                        ) : (
                            <>
                                <div className={'product_admin-grid-add_search_button'}>
                                    <ButtonDefault
                                        text={"добавить в категорию"}
                                        onClick={openSearchEditProductList}
                                        classButton={"search-product-admin"}
                                    />
                                </div>

                                {goods.map((item) => (
                                    <div
                                        key={`${item.guid}-${forceRenderKey}`}
                                        className="product-card-container"
                                    >
                                        <ProductCardWithMiddleClick
                                            item={item}
                                            onEdit={handleEdit}
                                            shouldShowOrderWrapper={shouldShowOrderWrapper}
                                            categoriesId={categoriesId}
                                            onUpdateSuccess={handleOrderUpdate}
                                            forceRenderKey={forceRenderKey}
                                            isLoadingState={shouldShowLoadingOnBlock}
                                        />
                                    </div>
                                ))}
                            </>
                        )}

                        <div ref={sentinelRef} style={{height: 1}}/>
                    </div>
                </>
            )}

            {openEditProductList && (
                <AddProductListAdmin
                    onClose={closeSearchEditProductList}
                    item={goods}
                    onProductsAdded={() => {
                        fetchGoodsDirectly();
                        closeSearchEditProductList();
                    }}
                />
            )}
        </div>
    );
};

export default ProductsAdmin;