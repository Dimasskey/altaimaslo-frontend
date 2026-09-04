import React from 'react';

import './favoritesItem.scss'
import StockStatus from "@shared/ui/StockStatus/StockStatus";
import ProductActions from "@shared/ui/productActions/ui/ProductActions";
import {useStore} from "@shared/providers/StoreProvider";
import {useSingleImageLoading} from "@shared/hooks/useSingleImageLoading";
import {useNavigate} from "react-router-dom";

const FavoritesItem = ({product, oldPrice, currentPrice, unit, stockStatus, isActionLoading, minQuantity, isAlwaysStore}) => {

    const {toggleFavorite} = useStore()
    const imgLoaded = useSingleImageLoading(product.img[0])
    const navigate = useNavigate()

    const handleRemoveFromFavorites = () => {
        toggleFavorite(product.id)
    }

    const hasPrices = oldPrice !== null || currentPrice !== null

    const isProductActionsLoading = isActionLoading(product.id)

    const handleRedirect = () => {
        navigate(`/Product/${product.id}`)
    }


    return (
        <div className={`favorites-item ${imgLoaded ? "loaded" : 'loading'}`}>
            <div className={'item-info-img'}>
                <img className={'item-info__image'} src={product.img[0]} alt="" onClick={handleRedirect}/>
            </div>
            <div className={'item-info-description'}>
                <span className={'info-description__name'} onClick={handleRedirect}>{product.name}</span>
                {hasPrices && <ProductActions
                    containerClass={'favorites-actions'}
                    oldPrice={oldPrice}
                    currentPrice={currentPrice}
                    unit={unit}
                    productId={product.id}
                    addToCartButton={true}
                    stockValue={product.stockStatus}
                    perOnePosition={'bottom'}
                    showDelete={true}
                    showFavorite={false}
                    inCart={false}
                    onRemoveContext={handleRemoveFromFavorites}
                    loading={isProductActionsLoading}
                    minQuantity={minQuantity}
                    isAlwaysStore={isAlwaysStore}
                />}
                <StockStatus unit={unit} value={stockStatus} isAlwaysStore={isAlwaysStore}/>
            </div>
        </div>
    );
};

export default FavoritesItem;