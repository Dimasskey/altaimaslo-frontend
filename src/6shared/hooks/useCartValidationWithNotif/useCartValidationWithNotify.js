import {useGoods} from "@shared/hooks/useGoods/useGoods";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import {useEffect, useRef, useState} from "react";

export const useCartValidationWithNotify = ({cartItems, syncInvalidCart}) => {
    const {getGoodsByGuids, data: products, loading} = useGoods();
    const {showInfo} = useStatusModal()

    const [isValidated, setIsValidated] = useState(false)
    const [prevCartIds, setPrevCartIds] = useState([])
    const hasNotifiedRef = useRef(false)
    const [loadingLocal, setLoadingLocal] = useState(true)

    useEffect(() => {
        if (cartItems.length === 0) {
            setLoadingLocal(false);
            return;
        }
    }, [cartItems]);

    useEffect(() => {
        const currentIds = cartItems.map(i => i.id);

        const areEqual =
            currentIds.length === prevCartIds.length &&
            currentIds.every((id, i) => id === prevCartIds[i]);

        if (!areEqual) {
            if (currentIds.length === 0) {
                setLoadingLocal(false);
                setPrevCartIds([]);
                return;
            }

            setLoadingLocal(true);
            getGoodsByGuids(currentIds, true);
            setPrevCartIds(currentIds);
        }
    }, [cartItems, getGoodsByGuids, prevCartIds]);

    useEffect(() => {
        if (loading || !products) return;

        const currentIds = cartItems.map(i => i.id);

        if (currentIds.length !== prevCartIds.length) return;

        const isSame = currentIds.every((id, i) => id === prevCartIds[i]);

        if (!isSame) return;

        const returnedIds = new Set(products.map(p => p.id));
        const filteredCart = cartItems.filter(item => returnedIds.has(item.id));

        if (filteredCart.length !== cartItems.length) {
            const removedCount = cartItems.length - filteredCart.length;

            syncInvalidCart(filteredCart)

            if (!hasNotifiedRef.current) {
                showInfo(
                    `Некоторые товары были удалены (${removedCount})`,
                    'Корзина обновлена'
                )
                hasNotifiedRef.current = true;
            }
        }
        setLoadingLocal(false)

        setIsValidated(true)
    }, [products, syncInvalidCart, cartItems, isValidated, showInfo])

    return {
        products,
        loading: loading || loadingLocal,
        isValidated
    }
}