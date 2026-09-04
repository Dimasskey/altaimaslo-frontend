import React, {useEffect, useMemo, useState} from 'react';

import './favoritesContent.scss'
import FavoritesList from "@/features/favorites/FavoritesList/FavoritesList";
import EmptyState from "@shared/ui/EmptyState/EmptyState";
import EmptyFavorites from "@shared/imges/svg/emptyFavorites.svg"
import {useStore} from "@shared/providers/StoreProvider";
import {useGoods} from "@shared/hooks/useGoods/useGoods";
import {sortProducts} from "@shared/utils/sortLocal";


const FavoritesContent = () => {
    const { favoriteItems, clearFavorites, isItemLoading, refresh, syncInvalidFavorites, isLoadingStore} = useStore();
    const { getGoodsByGuids, data: products, loading: goodsLoading } = useGoods(false);

    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [sortMethod, setSortMethod] = useState('alphabetic');

    useEffect(() => {
        refresh();
    }, [refresh]);

    useEffect(() => {
        if (favoriteItems.length > 0) {
            getGoodsByGuids(favoriteItems, true);
        }
    }, [favoriteItems, getGoodsByGuids]);

    useEffect(() => {
        if (!products) return;

        const returnedIds = new Set(products.map(p => p.id));
        const filteredFav = favoriteItems.filter(id => returnedIds.has(id));

        if (filteredFav.length !== favoriteItems.length) {
            syncInvalidFavorites(filteredFav);
        }
    }, [products, favoriteItems, syncInvalidFavorites]);

    useEffect(() => {
        if (!products || !favoriteItems) return;
        const enriched = products.filter(p => favoriteItems.includes(p.id));
        setFavoriteProducts(enriched);
    }, [products, favoriteItems]);

    const sortedProducts = useMemo(() => sortProducts(favoriteProducts, sortMethod), [favoriteProducts, sortMethod]);
    const handleSortChange = (value) => setSortMethod(value);

    const pageLoading = isLoadingStore || goodsLoading

    if (favoriteItems.length === 0) {
        return <EmptyState image={EmptyFavorites} title={'В избранном пока ничего нет'} description={'Здесь будут храниться товары, которые вас заинтересовали.'} />
    }

    return (
        <div className={`favorites-container`}>
            <FavoritesList
                favoriteProducts={sortedProducts}
                clearFavorites={clearFavorites}
                isActionsLoading={isItemLoading}
                loading={pageLoading}
                onSortChange={handleSortChange}
                sortMethod={sortMethod}
            />
        </div>
    );
};

export default FavoritesContent;