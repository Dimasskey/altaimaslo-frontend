import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import {useEffect, useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";

export function useRecommendation() {
    const {showError} = useStatusModal()
    const [recommendations, setRecommendations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const responce = await RequestFetch({
                    url: `/api/v1/goods/chart/recommendation`,
                    method: 'GET',
                    onSuccess: async (res) => {
                        if (res?.data) {
                            const processedRecommendations = res.data.map(item => ({
                                id: item.guid,
                                img: getAttachmentUrl(item.attachments[0]),
                                name: item.name,
                                currentPrice: item.current_price,
                                oldPrice: item.old_price,
                                unit: item.unit_quantity,
                                stockStatus: item.quantity,
                                isInBasket: item.is_in_basket,
                                quantityInBasket: item.quantity_in_basket,
                                isInFavorites: item.is_in_favorites
                            }))
                            setRecommendations(processedRecommendations)
                        } else {
                            showError('Рекомендации не найдены')
                        }
                        setLoading(false)
                    },
                    onError: (err) => {
                        showError(err?.message || 'Не удалось загрузить рекомендации');
                        setLoading(false)
                    }
                })
            } catch (error) {
                showError(error.message || 'Не удалось загрузить рекомендации');
                setLoading(false);
            }
        }
        fetchRecommendations();
    },[showError])

    return {recommendations, loading}
}