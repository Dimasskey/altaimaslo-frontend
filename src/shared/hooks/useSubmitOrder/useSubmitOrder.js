import {useCallback, useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useSubmitOrder = () => {
    const {showSuccess, showError} = useStatusModal()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const submitOrder = useCallback(async (orderData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const result = await RequestFetch({
                url: '/api/v1/orders',
                method: 'POST',
                body: orderData,
                onSuccess: () => {
                    setSuccess(true)
                    showSuccess('Заказ успешно оформлен!', '')
                },
                onError: (err) => {
                    setError(err.message)
                    showError(
                        err.message || "Не удалось оформить заказ",
                        'Ошибка'
                    )
                }
            })

            return result
        } finally {
            setIsLoading(false)
        }
    }, [showSuccess, showError])

    return {
        submitOrder,
        isLoading,
        error,
        success,
    }
}