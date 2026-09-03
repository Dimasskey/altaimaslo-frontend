import React, {useState, useEffect, useCallback, useRef} from 'react';
import "./addProductListAdminStyles.scss"
import CategoryHeaderAdmin from "@/4features/admin/categoryHeaderAdmin/ui/CategoryHeaderAdmin";
import {useSearchParams} from "react-router-dom";
import {useFilters} from "@shared/hooks/useFilters/useFilters";
import {useInfinityScroll} from "@shared/hooks/useInfinityScroll/useInfinityScroll";
import AddProductListItem from "@/5entities/admin/addProductListItem/ui/AddProductListItem";
import SearchHeaderAdmin from "@/3widgets/admin/productsAdmin/seacrhHeaderAdmin/ui/SearchHeaderAdmin";
import {useSearchGoodsAdmin} from "@shared/hooks/useSearchGoodsAdmin/useSearchGoodsAdmin";

const AddProductListAdmin = ({ onClose, item, onProductsAdded }) => {
    const [searchParams] = useSearchParams();
    const categoriesId = searchParams.get("categories_id");
    const categoryNameFromUrl = searchParams.get("category_name");

    const [searchText, setSearchText] = useState('');
    const [order, setOrder] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    const prevItemsLengthRef = useRef(0);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const { selectedFilters, handleFilterChange, clearFilters } = useFilters();

    const { goods: filteredGoods, filters, count, loading: goodsLoading, loadMore } = useSearchGoodsAdmin(
        null,
        searchText,
        selectedFilters,
        order
    );

    const {sentinelRef} = useInfinityScroll(() => {
        if (!goodsLoading) {
            setIsLoadingMore(true);
            loadMore();
        }
    });

    const productCount = count || 0;

    useEffect(() => {
        if (filteredGoods.length > 0) {
            setInitialLoading(false);
        } else if (!goodsLoading && filteredGoods.length === 0) {
            setInitialLoading(false);
        }
    }, [filteredGoods, goodsLoading]);

    useEffect(() => {
        setInitialLoading(true);
        prevItemsLengthRef.current = 0;
    }, [searchText, selectedFilters, order]);

    useEffect(() => {
        if (!goodsLoading) {
            setIsLoadingMore(false);
            // Запоминаем новую длину после загрузки
            prevItemsLengthRef.current = filteredGoods.length;
        }
    }, [goodsLoading, filteredGoods]);

    const getCategoryTitle = () => {
        if (categoryNameFromUrl) {
            const decodedName = decodeURIComponent(categoryNameFromUrl);
            if (decodedName.length > 20) {
                return `Добавить в категорию\n"${decodedName}"`;
            }
            return `Добавить в категорию "${decodedName}"`;
        }
        if (categoriesId) {
            return "Добавить товары в категорию";
        }
        return "Выбор товаров";
    };

    const handleSearchSubmit = (searchValue) => {
        setSearchText(searchValue);
    };

    const handleSelectProduct = useCallback((productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    }, []);

    const handleBackClick = useCallback(() => {
        if (onProductsAdded) {
            onProductsAdded();
        }
        onClose?.();
    }, [onClose, onProductsAdded]);

    useEffect(() => {
        setSelectedProducts([]);
    }, [searchText]);

    useEffect(() => {
        if (item && Array.isArray(item)) {
            const existingProductIds = item.map(product => product.guid);
            setSelectedProducts(prev => {
                const newIds = existingProductIds.filter(id => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    }, [item]);

    const isNewItem = (index) => {
        if (!isLoadingMore) return false;
        return index >= prevItemsLengthRef.current;
    };

    return (
        <div className={"add_product_list"}>
            <CategoryHeaderAdmin
                categoryTitle={getCategoryTitle()}
                productCount={productCount}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                selectedFilters={selectedFilters}
                count={count}
                onSortChange={setOrder}
                onClick={handleBackClick}
            />

            <div className={"add_product_list-search"}>
                <div className="add_product_list-search__header">
                    <SearchHeaderAdmin
                        onSearchSubmit={handleSearchSubmit}
                        initialSearchText={searchText}
                    />
                </div>
            </div>

            <div className={`add_product_list-content`}>
                {initialLoading ? (
                    <div className="add_product_list-loading loading">Загрузка товаров...</div>
                ) : filteredGoods.length === 0 ? (
                    <div className="add_product_list-empty">
                        {searchText ? `По запросу "${searchText}" товаров не найдено` : 'Товаров не найдено'}
                    </div>
                ) : (
                    <div className="add_product_list-grid">
                        {filteredGoods.map((product, index) => (
                            <AddProductListItem
                                goodsLoading={isNewItem(index)}
                                key={product.guid}
                                product={product}
                                isSelected={selectedProducts.includes(product.guid)}
                                onSelect={() => handleSelectProduct(product.guid)}
                                categoriesId={categoriesId}
                            />
                        ))}
                        <div ref={sentinelRef} style={{height: 1}}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddProductListAdmin;