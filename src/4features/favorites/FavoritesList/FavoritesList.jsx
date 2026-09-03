import React, {useEffect, useMemo} from 'react';

import './favoritesList.scss'
import CustomSelect from "@shared/ui/CustomSelect/CustomSelect";
import {SORT_METHODS} from "@shared/utils/testData/sortMethods";
import FavoritesItem from "@/4features/favorites/FavoritesItem/FavoritesItem";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const FavoritesList = ({favoriteProducts, clearFavorites, isActionsLoading, loading, onSortChange, sortMethod}) => {
    const isMobile = useIsMobile()

    const handleClearFavorites = () => {
        clearFavorites();
    }

    const handleSelectChange = (value) => {
        onSortChange(value)
    }

    return (
        <div className={`favorites ${loading ? 'loading' : 'loaded'}`}>
            <div className={'favorites-header'}>
                <div className={'header-title'}>
                    <div>
                        Избранное
                        <span className={'header-title__count'}>{favoriteProducts.length} товаров</span>
                    </div>
                    <button onClick={handleClearFavorites} className={'header-title__clear'}>Очистить избранное</button>
                </div>
                <div className={'header-select'}>
                    {!isMobile && (<span className={'header-select__title'}>Сортировка:</span>)}
                    <CustomSelect items={SORT_METHODS} value={sortMethod} onChange={handleSelectChange} />
                </div>
            </div>
            <div className={'favorites-list'}>
                {favoriteProducts.map((product) => (
                    <FavoritesItem
                        key={product.id}
                        product={product}
                        oldPrice={product.oldPrice}
                        currentPrice={product.currentPrice}
                        unit={product.unit}
                        stockStatus={product.stockStatus}
                        isActionLoading={isActionsLoading}
                        minQuantity={product.min_quantity}
                        isAlwaysStore={product.isAlwaysStore}
                    />

                ))}
            </div>

        </div>
    );
};

export default FavoritesList;