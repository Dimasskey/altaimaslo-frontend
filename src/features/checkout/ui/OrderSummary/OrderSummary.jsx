import React from 'react';

import './orderSummary.scss'
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useCheckout} from "@/features/checkout/model/CheckoutProvider";

const OrderSummary = () => {
    const { submitOrder, isSubmitting, cartItems, products, productsLoading} = useCheckout()

    const total = cartItems.reduce((sum, cartItem) => {
        const product = products?.find(p => p.id === cartItem.id);
        if (!product) return sum;
        return sum + (parseFloat(product.currentPrice) * cartItem.quantity);
    }, 0);

    return (
        <div className={'order-summary'}>
            <span className={'order-summary__title'}>Подтверждение заказа</span>
            <span className={'order-summary__total-title'}>Предварительный итог:</span>
            <div className={'order-summary-total'}>
                <span className={`order-summary-total__value ${productsLoading ? 'loading' : 'loaded'}`}>{total.toFixed(2)} ₽</span>
                <ButtonDefault onClick={submitOrder} classButton={'order-summary-total__button'} text={isSubmitting ? 'Оформляем...' : `Оформить заказ`} disabled={isSubmitting} />
            </div>
        </div>
    );
};

export default OrderSummary;