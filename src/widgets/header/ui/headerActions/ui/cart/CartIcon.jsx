import React from 'react';
import CartIconSvg from "@shared/imges/svg/cart.svg?react";

import {NavLink} from "react-router-dom";
import {CART} from "@shared/constants/constatns";
import {useStore} from "@shared/providers/StoreProvider";

const CartIcon = () => {
    const {cartItems} = useStore()

    return (
        <NavLink className="header-cart" to={CART}>
            {cartItems.length > 0 && (
                <div className={"header-cart__count"}>{cartItems.length}</div>
            )}
            <CartIconSvg className="header-cart__icon" />
            <span className="header-cart__text">Корзина</span>
        </NavLink>
    );
};

export default CartIcon;