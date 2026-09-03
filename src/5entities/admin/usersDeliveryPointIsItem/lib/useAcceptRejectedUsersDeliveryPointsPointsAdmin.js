import {RequestFetch} from "@shared/api/requestFetch";
import {useState} from "react";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useAcceptRejectedUsersDeliveryPointsPointsAdmin = (guid, onSuccessCallback) => {
    const [loading, setLoading] = useState(false)
    const {showSuccess, showError} = useStatusModal();

    const AcceptUsersDeliveryPointsPointsAdmin = async () => {
        setLoading(true)
        RequestFetch({
            url: `/api/v1/users_delivery_points/${guid}/accepted`,
            method: 'PATCH',
            onSuccess: () => {
                showSuccess('Адрес доставки подтвержден', 'Успех', {
                    onClose: () => {
                        setLoading(false)
                        if (onSuccessCallback) onSuccessCallback()
                    }
                });
            },
            onError: () => {
                showError('Не удалось подтвердить адрес доставки');
                setLoading(false)
            }
        })
    }

    const RejectUsersDeliveryPointsPointsAdmin = async () => {
        setLoading(true)
        RequestFetch({
            url: `/api/v1/users_delivery_points/${guid}/rejected`,
            method: 'PATCH',
            onSuccess: () => {
                showSuccess('Адрес доставки отклонен', 'Успех', {
                    onClose: () => {
                        setLoading(false)
                        if (onSuccessCallback) onSuccessCallback()
                    }
                });
            },
            onError: () => {
                showError('Не удалось отклонить адрес доставки');
                setLoading(false)
            }
        })
    }

    return {
        loading,
        AcceptUsersDeliveryPointsPointsAdmin,
        RejectUsersDeliveryPointsPointsAdmin,
    }
}