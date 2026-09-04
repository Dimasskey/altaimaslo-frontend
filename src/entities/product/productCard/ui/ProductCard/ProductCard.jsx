import React from 'react';
import "./productCard.scss"
import {useSingleImageLoading} from "@shared/hooks/useSingleImageLoading";
const ProductCard = ({
                         image,
                         title,
                         oldPrice = null,
                         currentPrice,
                         unit,
                         loading,
                         cartButton = null,
                         favoriteButton = null,
                         editingButton = null,
                         stockContainer = null,
                         authClass,
                         isAuth,
                         isEdited,
                         orderWrapper,

}) => {
    const imgLoaded = useSingleImageLoading(image)

    const showFooter = isAuth && (currentPrice !== null || oldPrice !== null);
    const shouldShowShimmer = loading || !imgLoaded


    const displayCurrentPrice = currentPrice !== null ? currentPrice : oldPrice !== null ? oldPrice : 0;
    const displayOldPrice = oldPrice !== null ? oldPrice : null;


    const showOldPrice = displayOldPrice !== null && displayOldPrice > displayCurrentPrice && currentPrice !== null;

    const shouldShowEditBlock = isEdited !== undefined && isEdited === false;


    return (
        <div className={`product-card ${shouldShowShimmer ? 'loading' : 'loaded'} ${authClass || showFooter === false ? 'noauth' : ''}`}>
            {shouldShowEditBlock && <div className={"product-card-is_edit"}>.</div>}
            <div className="product-card__header">
                <img className="product-card__img" src={image} alt=""/>
                <span className="product-card__title">{title}</span>
            </div>
            {orderWrapper}
            {showFooter && (
                <div className="product-card__footer">
                    <div className="product-card__price">
                        {showOldPrice && (
                            <div className="product-card__price-old">
                                {displayOldPrice} ₽
                            </div>
                        )}
                        <div
                            className={`product-card__price-current-wrapper ${!showOldPrice ? 'clear' : ''}`}
                            style={{
                                backgroundColor: !showOldPrice ? 'transparent' : undefined
                            }}
                        >
                            <div className={`product-card__price-current`}>{displayCurrentPrice} ₽</div>
                            <div className="product-card__price-unit">за {unit}</div>
                        </div>
                    </div>
                    <div className="product-card__button-wrapper">
                        {cartButton ? cartButton : editingButton}
                    </div>
                </div>
            )}
            {favoriteButton}
            {stockContainer}
        </div>

    );
};

export default ProductCard;