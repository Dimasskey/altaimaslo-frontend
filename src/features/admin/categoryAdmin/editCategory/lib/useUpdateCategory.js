import { useState } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";

export const useUpdateCategory = (showModal, onSuccessCallback) => {
    const [loading, setLoading] = useState(false)
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

    const updateCategory = async (categoryData) => {
        setLoading(true)
        resetActionStatus()

        RequestFetch({
            url: '/api/v1/categories',
            method: 'PATCH',
            body: [categoryData],
            onSuccess: async (res) => {
                setActionStatus({
                    isSuccess: true,
                    isError: false,
                    message: 'Категория успешно обновлена'
                });

                // Вызываем колбэк после успешного обновления
                if (onSuccessCallback) {
                    onSuccessCallback(res.data);
                }

                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось обновить категорию';
                setActionStatus({
                    isSuccess: false,
                    isError: true,
                    message: errorMessage
                });
                if (showModal) {
                    showModal({
                        error: "error",
                        title: 'Ошибка',
                        message: errorMessage
                    });
                }
                setLoading(false)
            },
            showModal,
        })
    }

    return {
        updateCategory,
        loading,
        actionStatus,
        resetActionStatus
    }
}