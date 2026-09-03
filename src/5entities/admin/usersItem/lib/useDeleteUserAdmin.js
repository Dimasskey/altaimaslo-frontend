import { useState } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useDeleteUserAdmin = (onSuccessCallback) => {
    const [loading, setLoading] = useState(false)
    const {showSuccess, showError} = useStatusModal();

    const [actionStatus, setActionStatus] = useState({
        isSuccess: false,
        isError: false,
        message: ''
    })

    const resetActionStatus = () => {
        setActionStatus({
            isSuccess: false,
            isError: false,
            message: ''
        });
    };

    const deleteUser = async (userGuid) => {
        setLoading(true)
        resetActionStatus()

        RequestFetch({
            url: '/api/v1/users/' + userGuid,
            method: 'DELETE',
            onSuccess: async (res) => {
                setActionStatus({
                    isSuccess: true,
                    isError: false,
                    message: 'Пользователь успешно удален'
                });

                showSuccess('Пользователь успешно удален');

                if (onSuccessCallback) {
                    onSuccessCallback(res.data);
                }
                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось удалить пользователя';
                setActionStatus({
                    isSuccess: false,
                    isError: true,
                    message: errorMessage
                });

                showError(errorMessage);
                setLoading(false)
            }
        })
    }

    return {
        deleteUser,
        loading,
        actionStatus,
        resetActionStatus
    }
}