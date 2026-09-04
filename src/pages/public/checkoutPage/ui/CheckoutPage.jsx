import React from 'react';
import DeliveryBlock from "@/features/checkout/ui/DeliveryBlock/DeliveryBlock";

import './checkoutPage.scss'
import {CheckoutProvider} from "@/features/checkout/model/CheckoutProvider";
import ContactBlock from "@/features/checkout/ui/ContactBlock/ContactBlock";
import OrderSummary from "@/features/checkout/ui/OrderSummary/OrderSummary";
import CheckoutCartList from "@/features/checkout/ui/CheckoutCartList/CheckoutCartList";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const CheckoutPage = () => {
    const isMobile = useIsMobile()

    return (
        <CheckoutProvider>

            <div className={'checkout'}>
                <div className={'checkout-details'}>
                    <span className={'checkout-title'}>Оформление заказа</span>
                    <DeliveryBlock />
                    <ContactBlock />
                </div>
                <div className={'checkout-summary'}>
                    {!isMobile ? (
                        <>
                            <OrderSummary />
                            <CheckoutCartList />
                        </>
                    ) : (
                        <>
                            <CheckoutCartList />
                            <OrderSummary />
                        </>
                    )}

                </div>
            </div>
        </CheckoutProvider>
    );
};

export default CheckoutPage;