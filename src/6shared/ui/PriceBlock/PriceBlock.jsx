import React from 'react';

import './priceBlock.scss'

const PriceBlock = ({
    oldPrice,
    currentPrice,
    count = 0,
    unit,
    perOnePosition, //bottom || right
    loading
                    }) => {


    const displayCurrentPrice =
        currentPrice !== null
            ? Number(currentPrice)
            : oldPrice !== null
                ? Number(oldPrice)
                : 0;

    const displayOldPrice =
        oldPrice !== null
            ? Number(oldPrice)
            : null;

    const showOldPrice =
        displayOldPrice !== null &&
        currentPrice !== null &&
        displayOldPrice > displayCurrentPrice;

    const totalOldPrice = showOldPrice
        ? (displayOldPrice * count).toFixed(2).replace('.', ',')
        : null;

    const totalCurrentPrice =
        (displayCurrentPrice * count).toFixed(2).replace('.', ',');
    return (
        <div className={`product-counter-price `}>
            {showOldPrice && (
                <div className={`counter-price__old ${loading ? 'loading' : 'loaded'}`}>
                    {count > 0 ? totalOldPrice : displayOldPrice} ₽
                </div>
            )}
            <div className={`counter-price-current ${perOnePosition === 'bottom' ? 'bottom' : 'right'}`}>
                <span className={`counter-price-current__value ${loading ? 'loading' : 'loaded'}`}
                      style={{backgroundColor: !showOldPrice ? 'transparent' : undefined}}>
                    {count > 0 ? totalCurrentPrice : displayCurrentPrice} ₽
                </span>
                <span className={'counter-price-current__perOne'}>
                    {displayCurrentPrice.toFixed(1)} за {unit}
                </span>
            </div>
        </div>

    );
};

export default PriceBlock;