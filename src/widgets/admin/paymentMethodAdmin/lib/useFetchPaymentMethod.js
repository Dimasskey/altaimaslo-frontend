import { useState, useCallback } from 'react';
import { RequestFetch } from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useFetchPaymentMethod = () => {
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useStatusModal();

    const baseUrl = '/api/v1/payment_methods';

    // GET - получение всех методов оплаты
    const getPaymentMethods = useCallback(() => {
        return new Promise((resolve, reject) => {
            setLoading(true);

            RequestFetch({
                url: baseUrl,
                method: 'GET',
                onSuccess: (res) => {
                    setLoading(false);
                    resolve(res.data);
                },
                onError: (error) => {
                    setLoading(false);
                    const errorMessage = error?.message || 'Не удалось загрузить методы оплаты';
                    showError(errorMessage, 'Ошибка');
                    reject(error);
                },
                showModal: showError
            });
        });
    }, [showError]);

    // GET - получение конкретного метода оплаты по ID
    const getPaymentMethod = useCallback((id) => {
        if (!id) {
            throw new Error('ID метода оплаты обязателен');
        }

        return new Promise((resolve, reject) => {
            setLoading(true);

            RequestFetch({
                url: `${baseUrl}/${id}`,
                method: 'GET',
                onSuccess: (res) => {
                    setLoading(false);
                    resolve(res.data);
                },
                onError: (error) => {
                    setLoading(false);
                    const errorMessage = error?.message || 'Не удалось загрузить метод оплаты';
                    showError(errorMessage, 'Ошибка');
                    reject(error);
                },
                showModal: showError
            });
        });
    }, [showError]);

    // POST - создание нового метода оплаты
    const createPaymentMethod = useCallback((paymentMethodData) => {
        if (!paymentMethodData.name) {
            throw new Error('Название метода оплаты обязательно');
        }

        return new Promise((resolve, reject) => {
            setLoading(true);

            RequestFetch({
                url: baseUrl,
                method: 'POST',
                body: paymentMethodData, // Просто передаем formData
                onSuccess: (res) => {
                    setLoading(false);
                    showSuccess('Метод оплаты успешно создан', 'Успех');
                    resolve(res.data);
                },
                onError: (error) => {
                    setLoading(false);
                    const errorMessage = error?.message || 'Не удалось создать метод оплаты';
                    showError(errorMessage, 'Ошибка');
                    reject(error);
                },
                showModal: showError
            });
        });
    }, [showSuccess, showError]);

    // PATCH - обновление метода оплаты
    const updatePaymentMethod = useCallback((id, paymentMethodData) => {
        if (!id) {
            throw new Error('ID метода оплаты обязателен');
        }

        if (!paymentMethodData.name) {
            throw new Error('Название метода оплаты обязательно');
        }

        return new Promise((resolve, reject) => {
            setLoading(true);

            RequestFetch({
                url: `${baseUrl}`,
                method: 'PATCH',
                body: paymentMethodData, // Просто передаем formData
                onSuccess: (res) => {
                    setLoading(false);
                    showSuccess('Метод оплаты успешно обновлен', 'Успех');
                    resolve(res.data);
                },
                onError: (error) => {
                    setLoading(false);
                    const errorMessage = error?.message || 'Не удалось обновить метод оплаты';
                    showError(errorMessage, 'Ошибка');
                    reject(error);
                },
                showModal: showError
            });
        });
    }, [showSuccess, showError]);

    // DELETE - удаление метода оплаты
    const deletePaymentMethod = useCallback((id) => {
        if (!id) {
            throw new Error('ID метода оплаты обязателен');
        }

        return new Promise((resolve, reject) => {
            setLoading(true);

            RequestFetch({
                url: `${baseUrl}/${id}`,
                method: 'DELETE',
                onSuccess: (res) => {
                    setLoading(false);
                    showSuccess('Метод оплаты успешно удален', 'Успех');
                    resolve(res.data || true);
                },
                onError: (error) => {
                    setLoading(false);
                    const errorMessage = error?.message || 'Не удалось удалить метод оплаты';
                    showError(errorMessage, 'Ошибка');
                    reject(error);
                },
                showModal: showError
            });
        });
    }, [showSuccess, showError]);

    return {
        getPaymentMethods,
        getPaymentMethod,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod,
        loading,
    };
};