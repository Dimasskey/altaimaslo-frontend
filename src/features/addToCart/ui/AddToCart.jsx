import React from "react";

import AddToCartButton from "@shared/buttons/AddToCartButton/AddToCartButton.jsx";
import {useStore} from "@shared/providers/StoreProvider";
import QuantityControl from "@shared/ui/QuantityControl/QuantityControl";

import './addToCart.scss'

const AddToCart = ({productId, quantity = 1, className, isAlwaysStore, stockStatus, unit, minQuantity}) => {
    const { cartItems, addItem, updateItem, removeItem} = useStore()

    const cartItem = cartItems.find(item => item.id === productId)

    const isInCart = !!cartItem

    const canAddToCart = isAlwaysStore || stockStatus > 0;


    const handleAddToCard = async () => {
        if (!canAddToCart) return
        await addItem(productId, quantity)
    }

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity <= 0) {
            await removeItem(productId)
            return
        }

        await updateItem(productId, newQuantity)
    }

    return (
        <>
            {isInCart ? (
                <QuantityControl
                    initialCount={cartItem.quantity}
                    unit={unit}
                    min={minQuantity}
                    onChange={handleQuantityChange}
                />
            ) : (
                <AddToCartButton
                    disabled={!canAddToCart}
                    className={className}
                    onClick={handleAddToCard}
                    isInCart={false}
                />
            )}
        </>

    )
};
export default AddToCart;