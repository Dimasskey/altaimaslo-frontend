import React, {useEffect, useMemo, useRef, useState} from 'react';
import RecommendationSlider from "@/4features/mainPage/recommendationSlider/ui/RecommendationSlider";
import CartList from "@/3widgets/cart/ui/CartList/CartList";
import CartTotal from "@/3widgets/cart/ui/CartTotal/CartTotal";
import cowCart from "@shared/imges/img/cowCart.png";
import cowEmptyCart from '@shared/imges/svg/cowCartInCart.svg';
import "./cartPage.scss";
import EmptyState from "@shared/ui/EmptyState/EmptyState";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import {useStore} from "@shared/providers/StoreProvider";
import {useCartValidationWithNotify} from "@shared/hooks/useCartValidationWithNotif/useCartValidationWithNotify";

const CartPage = () => {
    const isMobile = useIsMobile();
    const {cartItems, clearCart, isItemLoading, syncInvalidCart, isLoadingStore} = useStore();
    // const {getGoodsByGuids, data: products, loading: goodsLoading} = useGoods();
    const {products, loading: goodsLoading } = useCartValidationWithNotify({cartItems, syncInvalidCart})




    // const [isInitialValidationDone, setIsInitialValidationDone] = useState(false);

    // useEffect(() => {
    //     const currentIds = cartItems.map(i => i.id);
    //     const areEqual = currentIds.length === prevCartIds.length &&
    //         currentIds.every((id, i) => id === prevCartIds[i]);
    //
    //     if (!areEqual && cartItems.length > 0) {
    //         getGoodsByGuids(currentIds, true);
    //         setPrevCartIds(currentIds);
    //     }
    // }, [cartItems, getGoodsByGuids, prevCartIds]);

    // useEffect(() => {
    //     if (!products || isInitialValidationDone) return;
    //
    //     const returnedIds = new Set(products.map(p => p.id));
    //     const filteredCart = cartItems.filter(item => returnedIds.has(item.id));
    //
    //     if (filteredCart.length !== cartItems.length) {
    //         syncInvalidCart(filteredCart);
    //     }
    //     setIsInitialValidationDone(true);
    // }, [products, cartItems, syncInvalidCart, isInitialValidationDone]);

    const productsInCart = useMemo(() => {
        if (!products || !cartItems) return [];

        const productMap = products.reduce((acc, p) => {
            acc[p.id] = p;
            return acc;
        }, {});

        return cartItems
            .map(item => {
                const product = productMap[item.id];
                return product ? {...product, quantity: item.quantity} : null;
            })
            .filter(Boolean);
    }, [products, cartItems]);

    const hasItems = cartItems.length > 0;


    const isInitialLoading = isLoadingStore || (goodsLoading && cartItems.length === 0)
    const isUpdating = goodsLoading && cartItems.length > 0;

    const showEmpty = !isInitialLoading && cartItems.length === 0;

    useEffect(() => {
        if (hasItems && isMobile) {
            document.body.style.paddingBottom = "25vw";
        } else {
            document.body.style.paddingBottom = '';
        }
        return () => {
            document.body.style.paddingBottom = '';
        };
    }, [hasItems, isMobile]);

    return (
        <>
            {/*{!isMobile && <TopLink />}*/}
            {/*<Header />*/}
            <div className={`cart-container ${isInitialLoading ? 'loading' : 'loaded'} `}>
                {showEmpty ? (
                    <EmptyState
                        image={cowEmptyCart}
                        title={'Корзина пока пуста'}
                        description={'Вернитесь в каталог или воспользуйтесь поиском, чтобы продолжить свои покупки'}
                    />
                ) : (
                    <>
                        <CartList
                            productsInCart={productsInCart}
                            isItemLoading={isItemLoading}
                            clearCart={clearCart}
                            loading={isUpdating}
                        />
                        {!isMobile && (
                            <div className={'cart-total-and-cow'}>
                                <CartTotal
                                    productsInCart={productsInCart}
                                    cartItems={cartItems}
                                    loading={isUpdating}
                                />
                                <img src={cowCart} alt="cow cart" />
                            </div>
                        )}
                        {isMobile && (
                            <div className={'cart-total-fixed'}>
                                <CartTotal
                                    productsInCart={productsInCart}
                                    cartItems={cartItems}
                                    loading={isUpdating}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <RecommendationSlider />
        </>
    );
};

export default CartPage;