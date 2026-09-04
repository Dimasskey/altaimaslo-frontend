import { useState } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";

export const useAddCategory = (showModal, onSuccessCallback) => {
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

    const addCategory = async (categoryData) => {
        setLoading(true)
        resetActionStatus()

        RequestFetch({
            url: '/api/v1/categories',
            method: 'POST',
            body: categoryData,
            onSuccess: async (res) => {
                setActionStatus({
                    isSuccess: true,
                    isError: false,
                    message: 'Категория успешно добавлена'
                });

                // Вызываем колбэк после успешного добавления
                if (onSuccessCallback) {
                    onSuccessCallback(res.data);
                }

                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось добавить категорию';
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
        addCategory,
        loading,
        actionStatus,
        resetActionStatus
    }
}