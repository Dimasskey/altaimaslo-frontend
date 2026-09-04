import {useEffect, useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";

export const useSlider = () => {
    const [sliders, setSliders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSliders = async () => {
            setLoading(true);
            try {
                await RequestFetch({
                    url: '/api/v1/sliders',
                    onSuccess: (data) => {
                        if (data && data.data) {
                            setSliders(data.data)
                        } else {
                            setError('Нет данных слайдера')
                        }
                    },
                    onError: (err) => {
                        setError(err.message || "Ошибка загрузки слайдеров")
                    }
                })
            } catch (err) {
                setError('Не удалось загрузить слайдеры')
            } finally {
                setLoading(false)
            }
        }

        fetchSliders()
    }, [])

    return { sliders, loading, error };
}