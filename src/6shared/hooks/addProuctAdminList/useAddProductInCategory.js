import { useState, useCallback } from 'react';
import { RequestFetch } from '@shared/api/requestFetch';
import { useStatusModal } from '@/1app/providers/statusModalProvider/statusModalProvider';

export function useAddProductInCategory() {
    const { showSuccess, showError } = useStatusModal();
    const [isLoading, setIsLoading] = useState(false);

    const updateProductInCategory = useCallback(async (categoryId, productId, remove = false, orderNumber = null) => {
        if (!categoryId || !productId) {
            showError('Не указан ID категории или товара');
            return { success: false };
        }

        setIsLoading(true);

        try {
            const result = await new Promise((resolve) => {
                // Формируем URL с параметрами
                let url = `/api/v1/categories/${categoryId}/goods/${productId}?remove=${remove}`;

                // Добавляем order_number, если он указан
                if (orderNumber !== null && !remove) {
                    url += `&order_number=${orderNumber}`;
                }

                RequestFetch({
                    url: url,
                    method: 'PATCH',
                    body: null,
                    onSuccess: (res) => {
                        setIsLoading(false);

                        // Показываем успешное уведомление ТОЛЬКО при удалении
                        if (remove) {
                            showSuccess('Товар успешно удален из категории');
                        }
                        // Для добавления товара и обновления порядкового номера НЕ показываем уведомления

                        resolve({
                            success: true,
                            data: res?.data,
                            removed: remove,
                            orderNumber: orderNumber
                        });
                    },
                    onError: (err) => {
                        setIsLoading(false);

                        // Формируем сообщение об ошибке
                        let errorMessage = 'Произошла ошибка';

                        if (remove) {
                            errorMessage = err?.message || 'Ошибка при удалении товара из категории';
                        } else if (orderNumber !== null) {
                            errorMessage = err?.message || 'Ошибка при обновлении порядкового номера';
                        } else {
                            errorMessage = err?.message || 'Ошибка при добавлении товара в категорию';
                        }

                        showError(errorMessage);

                        resolve({
                            success: false,
                            error: err,
                            removed: remove,
                            orderNumber: orderNumber
                        });
                    }
                });
            });

            return result;
        } catch (error) {
            console.error('Ошибка при обновлении товара в категории:', error);
            showError('Произошла непредвиденная ошибка');
            setIsLoading(false);
            return {
                success: false,
                error,
                removed: remove,
                orderNumber: orderNumber
            };
        }
    }, [showSuccess, showError]);

    return {
        updateProductInCategory,
        isLoading,
    };
}