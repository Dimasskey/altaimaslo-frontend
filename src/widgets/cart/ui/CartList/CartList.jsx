import React from 'react';

import "./cartList.scss"
import CartItem from "@/widgets/cart/ui/CartItem/CartItem";

const CartList = ({productsInCart, isItemLoading, clearCart, loading }) => {

    return (
        <div className={`cart ${loading ? 'loading' : 'loaded'}`}>
                <div className={'cart-header'}>
                    <span className={'cart-header__title'}>Корзина</span>
                    <button
                        className={'cart-header__clear'}
                        onClick={clearCart}
                    >
                        Очистить корзину
                    </button>
                </div>
                <div className={`cart-list ${loading ? 'loading' : 'loaded'}`}>
                    {productsInCart.map((product) => (
                        <CartItem
                            key={product.id}
                            product={product}
                            oldPrice={product.oldPrice}
                            currentPrice={product.currentPrice}
                            unit={product.unit}
                            stockStatus={product.stockStatus}
                            initialCount={product.quantity}
                            isActionLoading={isItemLoading}
                            minQuantity={product.min_quantity}
                            isAlwaysStore={product.isAlwaysStore}
                        />
                    ))}
                </div>
        </div>
    );
};

export default CartList;