import React from 'react';

import './checkoutCartList.scss'
import {NavLink} from "react-router-dom";
import {CART} from "@shared/constants/constatns";
import {useCheckout} from "@/features/checkout/model/CheckoutProvider";

const CheckoutCartList = () => {
    const {cartItems, products, productsLoading} = useCheckout();

    const cartWithProducts = cartItems
        .map(cartItem => {
            const product = products?.find(p => p.id === cartItem.id);
            return product ? {...cartItem, ...product} : null;
        })
        .filter(Boolean);

    return (
        <div className={`checkout-cart-list `}>
            <div className={'cart-list-header'}>
                <span className={'cart-list-header__title'}>Состав заказа</span>
                <NavLink to={CART} className={'cart-list-header__edit'}>Редактировать</NavLink>
            </div>
            <div className={`cart-list ${productsLoading ? 'loading' : 'loaded'}`}>
                {cartWithProducts.map((cartItem, index) => {
                    return (
                        <div key={cartItem.id} className={'cart-list__item'}>
                            <span>{index + 1}.</span>
                            <span className={'cart-list__item-name'}>{cartItem.name}</span>
                            <span className={'cart-list__item-quantity'}>{cartItem.quantity} {cartItem.unit}</span>
                            <span className={'cart-list__item-total'}>
                                {(parseFloat(cartItem?.currentPrice) * cartItem.quantity).toFixed(2)} ₽
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default CheckoutCartList;