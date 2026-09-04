import { useState, useEffect } from 'react'
import {RequestFetch} from "@shared/api/requestFetch";

export const useFetchCategories = (showModal) => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const sortCategories = (categoriesList) => {
        if (!categoriesList || !Array.isArray(categoriesList)) {
            return [];
        }
        return [...categoriesList].sort((a, b) => {
            const orderA = a.order_number || 0;
            const orderB = b.order_number || 0;
            return orderA - orderB;
        });
    };

    const fetchCategories = async () => {
        setLoading(true)
        setError(null)

        RequestFetch({
            url: '/api/v1/categories',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    const sortedCategories = sortCategories(res.data);
                    setCategories(sortedCategories)
                }
                setLoading(false)
            },
            onError: (error) => {
                const errorMessage = error?.message || 'Не удалось загрузить категории';
                setError(errorMessage)
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

    useEffect(() => {
        fetchCategories()
    }, [])

    return {
        categories,
        loading,
        error,
        fetchCategories,
        setCategories
    }
}