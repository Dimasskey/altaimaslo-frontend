import { useState, useCallback } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";

export const useUpdateCategoryOrder = (showModal, onSuccessCallback) => {
    const [loading, setLoading] = useState(false)
    const [actionStatus, setActionStatus] = useState({
        isSuccess: false,
        isError: false,
        message: ''
    })

    const resetActionStatus = useCallback(() => {
        setActionStatus({
            isSuccess: false,
            isError: false,
            message: ''
        });
    }, []);

    const updateCategoryOrder = useCallback(async (categories) => {
        setLoading(true)
        resetActionStatus()

        // Подготавливаем данные для обновления
        const updateData = categories.map((category, index) => ({
            id: category.id,
            name: category.name,
            attachments_guid: category.attachments_guid,
            order_number: index + 1
        }));

        RequestFetch({
            url: '/api/v1/categories',
            method: 'PATCH',
            body: updateData,
            onSuccess: async (res) => {
                setActionStatus({
                    isSuccess: true,
                    isError: false,
                    message: 'Порядок категорий успешно обновлен'
                });

                if (onSuccessCallback) {
                    onSuccessCallback(res.data);
                }
                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось обновить порядок категорий';
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
    }, [resetActionStatus, showModal, onSuccessCallback]);

    return {
        updateCategoryOrder,
        loading,
        actionStatus,
        resetActionStatus
    }
}