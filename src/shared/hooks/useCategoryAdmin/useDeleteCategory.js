import { useState } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";

export const useDeleteCategory = (showModal, onSuccessCallback) => {
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

    const deleteCategory = async (categoryData) => {
        setLoading(true)
        resetActionStatus()

        let _id = categoryData.id
        RequestFetch({
            url: '/api/v1/categories/' + _id,
            method: 'DELETE',
            body: JSON.stringify(categoryData),
            onSuccess: async (res) => {
                setActionStatus({
                    isSuccess: true,
                    isError: false,
                    message: 'Категория успешно удалена'
                });

                // Вызываем колбэк после успешного удаления
                if (onSuccessCallback) {
                    onSuccessCallback(res.data);
                }

                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось удалить категорию';
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
        deleteCategory,
        loading,
        actionStatus,
        resetActionStatus
    }
}