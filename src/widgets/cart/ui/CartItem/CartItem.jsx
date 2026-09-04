import React from 'react';

import "./CartItem.scss"
import ProductActions from "@shared/ui/productActions/ui/ProductActions";
import StockStatus from "@shared/ui/StockStatus/StockStatus";
import {useStore} from "@shared/providers/StoreProvider";
import {useSingleImageLoading} from "@shared/hooks/useSingleImageLoading";
import {useNavigate} from "react-router-dom";

const CartItem = ({product, oldPrice, currentPrice, unit, stockStatus, isActionLoading, minQuantity, isAlwaysStore}) => {
    const {removeItem} = useStore()
    const imgLoaded = useSingleImageLoading(product.img[0])
    const navigate = useNavigate()

    const handleRemoveFromCart = () => {
        removeItem(product.id)
    }

    const isProductActionsLoading = isActionLoading(product.id)

    const handleRedirect = () => {
        navigate(`/Product/${product.id}`)
    }



    return (
        <div className={`cart-item ${imgLoaded ? "loaded" : 'loading'}`}>
            <div className={'item-info-image'}>
                <img className={'item-info-image__img'} src={product.img[0]} alt="" onClick={handleRedirect}/>
            </div>
            <div className={'item-info-description'}>
                <span className={'info-description__name'} onClick={handleRedirect}>{product.name}</span>
                <ProductActions
                    containerClass={'cart-actions'}
                    oldPrice={oldPrice}
                    currentPrice={currentPrice}
                    unit={unit}
                    productId={product.id}
                    addToCartButton={false}
                    stockValue={product.stockStatus}
                    perOnePosition={'bottom'}
                    showDelete={true}
                    showFavorite={true}
                    inCart={true}
                    onRemoveContext={handleRemoveFromCart}
                    loading={isProductActionsLoading}
                    minQuantity={minQuantity}
                />
            </div>
            <StockStatus unit={unit} value={stockStatus} isAlwaysStore={isAlwaysStore}/>
        </div>
    );
};

export default CartItem;