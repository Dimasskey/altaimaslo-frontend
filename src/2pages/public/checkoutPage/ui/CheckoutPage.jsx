import React from 'react';
import TopLink from "@/3widgets/topLink/TopLink";
import Header from "@/3widgets/header/ui/Header";
import DeliveryBlock from "@/4features/checkout/ui/DeliveryBlock/DeliveryBlock";

import './checkoutPage.scss'
import {CheckoutProvider} from "@/4features/checkout/model/CheckoutProvider";
import PaymentBlock from "@/4features/checkout/ui/PaymentBlock/PaymentBlock";
import ContactBlock from "@/4features/checkout/ui/ContactBlock/ContactBlock";
import OrderSummary from "@/4features/checkout/ui/OrderSummary/OrderSummary";
import CheckoutCartList from "@/4features/checkout/ui/CheckoutCartList/CheckoutCartList";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const CheckoutPage = () => {
    const isMobile = useIsMobile()

    return (
        <CheckoutProvider>
            {/*{!isMobile &&  <TopLink />}*/}
            {/*<Header />*/}
            <div className={'checkout'}>
                <div className={'checkout-details'}>
                    <span className={'checkout-title'}>Оформление заказа</span>
                    <DeliveryBlock />
                    {/*<PaymentBlock />*/}
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