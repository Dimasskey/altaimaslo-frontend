import React, {useEffect, useState} from 'react';

import "./productActions.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import ProductCounter from "@shared/ui/ProductCounter/ProductCounter";
import {useStore} from "@shared/providers/StoreProvider";



const ProductActions = ({
    containerClass,
    oldPrice,
    currentPrice,
    unit,
    stockValue,
    productId,
    perOnePosition = 'bottom',
    addToCartButton = true,
    showDelete = true,
    showFavorite = true,
    inCart = false,
    onRemoveContext,
    loading,
    minQuantity,
    isAlwaysStore
}) => {
    const {cartItems, addItem, updateItem, removeItem} = useStore()
    const cartItem = cartItems.find(i => i.id === productId);
    const isInCart = !!cartItem;

    const [localCount, setLocalCount] = useState(minQuantity)

    const count = isInCart ? cartItem.quantity : localCount

    const maxAvailable = stockValue;

    useEffect(() => {
        if (isInCart) {
            setLocalCount(cartItem.quantity)
        } else {
            setLocalCount(minQuantity)
        }
    }, [isInCart, cartItem, minQuantity]);



    const handleCountChange = async (newCount) => {
        if (loading) return

        if (!isInCart) {
            setLocalCount(newCount)
            return
        }

        if (newCount === 0) {
            setLocalCount(1)
        } else {
            await updateItem(productId, newCount)
        }
    }

    const handleAdd = async () => {
        if (loading) return
        if (!isInCart) {
            await addItem(productId, localCount)
        }
    }

    const handleRemove = async () => {
        if (loading) return
        await onRemoveContext();
        if (isInCart) {
            setLocalCount(minQuantity);
        }
    };

    return (
        <div className={`product-actions ${containerClass}`}>
            <ProductCounter
                productId={productId}
                oldPrice={oldPrice}
                currentPrice={currentPrice}
                unit={unit}
                count={count}
                stockValue={stockValue}
                onChange={handleCountChange}
                perOnePosition={perOnePosition}
                showDelete={showDelete}
                showFavorite={showFavorite}
                showAddToCart={addToCartButton}
                onRemoveContext = {handleRemove}
                loading={loading}
                min={minQuantity}
                isAlwaysStore={isAlwaysStore}
            />
        </div>

    );
};

export default ProductActions;