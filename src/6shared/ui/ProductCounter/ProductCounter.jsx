import React from 'react';
import PriceBlock from "@shared/ui/PriceBlock/PriceBlock";
import QuantityControl from "@shared/ui/QuantityControl/QuantityControl";
import './productCounter.scss'
import ActionsButtons from "@shared/ui/ActionsButtons/ActionsButtons";
import AddToCartButton from "@shared/buttons/AddToCartButton/AddToCartButton";
import AddToCart from "@/4features/addToCart/ui/AddToCart";

const
    ProductCounter = ({
    productId,
    oldPrice,
    currentPrice,
    unit,
    stockValue,
    count,
    onChange,
    perOnePosition,
    min = 1,
    max = 999,
    showDelete,
    showFavorite,
    showAddToCart,
    onRemoveContext,
    loading,
    isAlwaysStore

                        }) => {
    return (
        <div className={
            `
            product-counter 
            ${perOnePosition === 'bottom' ? 'bottom' : 'right' }
            ${showAddToCart ? 'cartbtn' : ''}
            `
        }>
            <PriceBlock
                oldPrice={oldPrice}
                currentPrice={currentPrice}
                unit={unit}
                perOnePosition={perOnePosition}
                count={count}
                loading={loading}
            />
            <ActionsButtons productId={productId} showDelete={showDelete} showFavorite={showFavorite} onRemove={onRemoveContext}/>
            <div className={'product-counter-actions'}>
                {/*<QuantityControl*/}
                {/*    initialCount={count}*/}
                {/*    unit={unit}*/}
                {/*    onChange={onChange}*/}
                {/*    min={min}*/}
                {/*    max={max}*/}
                {/*    disabled={loading}*/}
                {/*/>*/}
                {/*{showAddToCart && (*/}
                    <AddToCart productId={productId} quantity={count} isAlwaysStore={isAlwaysStore} stockStatus={stockValue} unit={unit} minQuantity={min}/>
                {/*)}*/}
            </div>
        </div>
    );
};

export default ProductCounter;