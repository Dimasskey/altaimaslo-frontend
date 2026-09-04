import {createContext, useContext, useState} from "react";


import {useStore} from "@shared/providers/StoreProvider";
import {useSubmitOrder} from "@shared/hooks/useSubmitOrder/useSubmitOrder";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

import {useNavigate} from "react-router-dom";
import {useCartValidationWithNotify} from "@shared/hooks/useCartValidationWithNotif/useCartValidationWithNotify";

const CheckoutContext = createContext()

export const useCheckout = () => {
    const context = useContext(CheckoutContext)
    if (!context) {
        throw new Error('useCheckout must be used within CheckoutProvider')
    }
    return context
}

export const CheckoutProvider = ({ children }) => {
    const navigate = useNavigate()
    const {showError} = useStatusModal()
    const {cartItems, clearCart, syncInvalidCart} = useStore()
    const [deliveryData, setDeliveryData] = useState({ addressId: null, comment: '', contactData: null, })
    const [contactLoading, setContactLoading] = useState(false)
    const {products, loading: productsLoading} = useCartValidationWithNotify({cartItems, syncInvalidCart})

    const {submitOrder: submitOrderApi, isLoading} = useSubmitOrder()

    const updateDeliveryData = (data) => {
        setDeliveryData(prev => ({...prev, ...data}))
    }

    const submitOrder = async () => {

        if (!deliveryData.addressId) {
            showError('Пожалуйста, выберите адрес доставки', 'Ошибка')
            return
        }

        const orderData = {
            users_delivery_points_guid: deliveryData.addressId,
            comment: deliveryData.comment || '',
            goods: cartItems.map((item) => ({
                guid: item.id,
                quantity: item.quantity || 0,
            })),
        }

        try {
            const res = await submitOrderApi(orderData)

            if (res?.success) {
                clearCart()
                navigate('/profile/orders')
            }
        } catch (e) {
            showError(`Ошибка оформление заказа, ${e}`, 'Что-то пошло не так...')
        }
    }

    const value = {
        cartItems,
        deliveryData,
        isSubmitting: isLoading,
        contactLoading,
        setContactLoading,
        updateDeliveryData,
        submitOrder,
        products,
        productsLoading,
    }

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    )
}

