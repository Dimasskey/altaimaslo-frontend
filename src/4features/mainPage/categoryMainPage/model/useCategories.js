import {useEffect, useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export function useCategories() {
    const {showError} = useStatusModal()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        RequestFetch({
            url: '/api/v1/categories',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setCategories(res.data)
                } else {
                    showError(res?.message || 'Категории не найдены')
                }
                setLoading(false)
            },
            onError: (err) => {
                showError(err?.message || 'Не удалось загрузить категории');
                setLoading(false)
            },
        })
    }, [showError])

    const getCategoryById = (id) => {
        const numId = Number(id); // ← приводим к числу
        return categories.find((category) => category.id === numId) || null
    }

    return {categories, getCategoryById, loading}
}