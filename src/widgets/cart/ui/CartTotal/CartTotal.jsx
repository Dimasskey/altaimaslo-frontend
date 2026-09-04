import React, {useMemo} from 'react';

import './cartTotal.scss'
import OrderProgress from "@/features/cart/ui/OrderProgress/OrderProgress";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const CartTotal = ({productsInCart, cartItems, loading}) => {

    const isMobile = useIsMobile()

    const totalAmount = useMemo(() => {
        return (productsInCart || []).reduce((sum, p) => {
            const item = cartItems.find(i => i.id === p.id);
            if (!item) return sum;
            return sum + p.currentPrice * item.quantity;
        }, 0);
    }, [productsInCart, cartItems]);

    const itemsCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <div className={`cart-total ${loading ? 'loading' : 'loaded'}`}>
            {!isMobile && (
                <div className={'total-count'}>
                    <span className={'total-count__title'}>
                        Итого:
                    </span>
                    <span className={'total-count__value'}>
                        {itemsCount} товара
                    </span>
                </div>
            )}

            <div className={'total-amount'}>
                <div className={'total-amount-wrapper'}>
                    <span className={'total-amount__title'}>
                        На сумму:
                    </span>
                    <span className={'total-amount__value'}>
                        {totalAmount.toFixed(2)}
                    </span>
                </div>
                {isMobile && <OrderProgress currentAmount={totalAmount} />}
            </div>
            {!isMobile && <OrderProgress currentAmount={totalAmount} />}
        </div>
    );
};

export default CartTotal;