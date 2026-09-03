import React from 'react';

import './productCard.scss'
import AddToCart from "@/4features/addToCart/ui/AddToCart";
import AddToFavorites from "@/4features/addToFavorites/ui/AddToFavorites";
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import StockStatus from "@shared/ui/StockStatus/StockStatus";
import QuantityControl from "@shared/ui/QuantityControl/QuantityControl";
import {useSingleImageLoading} from "@shared/hooks/useSingleImageLoading";

const ProductCardMobile = ({
   id,
   image,
   title,
   oldPrice = null,
   currentPrice,
   unit,
   stockStatus,
   loading,
   cartButton = <AddToCart productId={id}/>,
   favoriteButton = <AddToFavorites productId={id}/>,
   editingButton = <ButtonDefault classButton={"product-card__edit"} text={"Редактировать"} />,
   stockContainer = <StockStatus value={stockStatus} unit={unit}/>,
    isAuth
}) => {
    const imgLoaded = useSingleImageLoading(image)
    const shouldShowShimmer = loading || !imgLoaded
    const showPriceAndButtons = isAuth && (currentPrice !== null || oldPrice !== null);

    const displayCurrentPrice = currentPrice !== null ? currentPrice : oldPrice !== null ? oldPrice : 0;
    const displayOldPrice = oldPrice !== null ? oldPrice : null;


    const showOldPrice = displayOldPrice !== null && displayOldPrice > displayCurrentPrice && currentPrice !== null;

    return (
        <div className={`product-card-mobile ${shouldShowShimmer ? 'loading' : 'loaded'}`}>
            <div className={'product-card-mobile-image'}>
                <img className="product-card-mobile__img" src={image} alt=""/>
            </div>
            <div className={'product-card-mobile-content'}>
                <div className={`product-card-mobile__header`}>
                    <span className={'product-card-mobile__name'}>{title}</span>
                    {showPriceAndButtons && favoriteButton}
                </div>
                {showPriceAndButtons && (
                    <div className={`product-card-mobile__price`}>
                        <div className={'product-card-mobile__current'}
                             style={{backgroundColor: !showOldPrice ? 'transparent' : undefined}}>
                            <span className={'product-card-mobile__current-price'}>{displayCurrentPrice} ₽</span>
                            <span className={'product-card-mobile__current-unit'}>за {unit}</span>
                        </div>
                        {showOldPrice && (
                            <span className={'product-card-mobile__old'}>
                                {displayOldPrice} ₽
                            </span>
                        )}
                        {stockContainer}
                    </div>
                )}
                {showPriceAndButtons && (
                    <div className={`product-card-mobile__control`}>
                        {cartButton || editingButton}
                    </div>
                )}

            </div>

        </div>
    );
};

export default ProductCardMobile;