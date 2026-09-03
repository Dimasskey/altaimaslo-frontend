import {useCallback, useState} from "react";
import {useStatusModal} from '@/1app/providers/statusModalProvider/statusModalProvider'
import {getAttachmentUrl} from "@shared/api/getAttachmentUrl";
import {RequestFetch} from "@shared/api/requestFetch";

export function useGoods(is_good = false) {
    const {showError, showSuccess} = useStatusModal();

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)

    const normalizeProduct = (item) => ({
        id: item.guid,
        img: item.attachments?.length
            ? item.attachments.map(guid => getAttachmentUrl(guid, is_good))
            : [],
        originalAttachments: item.attachments || [],
        name: item.name,
        currentPrice: item.current_price,
        oldPrice: item.old_price,
        unit: item.unit_quantity,
        stockStatus: item.quantity,
        about: item.about || '',
        measures: item.measures || [],
        isAlwaysStore: item.is_allways_store,
        min_quantity: item.min_quantity,
    })

    const fetchData = useCallback(async (url) => {
        setLoading(true);
        await RequestFetch({
            url,
            method: 'GET',
            onSuccess: (res) => {
                if (res?.data === null || res?.data === undefined) {
                    setData(null);
                } else if (Array.isArray(res.data)) {
                    setData(res.data.map(normalizeProduct));
                } else {
                    setData(normalizeProduct(res.data));
                }
                setLoading(false);
            },
            onError: (err) => {
                showError(err?.message || 'Ошибка загрузки товаров');
                setLoading(false);
            }
        });
    }, [showError]);

    const updateGoods = useCallback(async (goods_guid, updateData) => {
        setUpdating(true);

        const requestData = {
            name: updateData.name,
            about: updateData.about || '',
            attachments: updateData.attachments || [],
            measures: updateData.measures || [],
            min_quantity: updateData.min_quantity || 1,
        };

        return new Promise((resolve, reject) => {
            RequestFetch({
                url: `/api/v1/goods/${goods_guid}`,
                method: 'PATCH',
                body: requestData,

                onSuccess: (res) => {
                    if (!res?.data) {
                        showError('Данные не найдены');
                        setUpdating(false);
                        reject(new Error('Данные не найдены'));
                        return;
                    }

                    const updatedProduct = normalizeProduct(res.data);

                    setData(prevData => {
                        if (Array.isArray(prevData)) {
                            return prevData.map(item =>
                                item.id === goods_guid ? updatedProduct : item
                            );
                        } else if (prevData?.id === goods_guid) {
                            return updatedProduct;
                        }
                        return prevData;
                    });

                    setUpdating(false);
                    resolve(updatedProduct);
                },

                onError: (err) => {
                    console.error('Ошибка обновления товара:', err);
                    showError(err?.message || 'Ошибка обновления товара');
                    setUpdating(false);
                    reject(err);
                }
            });
        });
    }, [showError, showSuccess]);

    const getAllGoods = useCallback(() => {
        return fetchData('/api/v1/goods')
    },[fetchData])

    const getGoodsByGuid = useCallback((goods_guid) => {
        return fetchData(`/api/v1/goods/${goods_guid}`)
    }, [fetchData])

    const getGoodsByCategories = useCallback((categories_id) => {
        return fetchData(`/api/v1/goods/${categories_id}`)
    }, [fetchData])

    const getRecommendation = useCallback(() => {
        return fetchData('/api/v1/goods/chart/recommendation')
    }, [fetchData])

    const getGoodsByGuids = useCallback((goods_guids, short = false) => {
        const url = `/api/v1/goods/?short=${short}`

        setLoading(true)
        RequestFetch({
            url: url.toString(),
            method: 'GET',
            headers: {
                'goods-guids': goods_guids.join(','),
            },
            onSuccess: (res) => {
                if (!res?.data) {
                    setData([])
                    setLoading(false)
                    return;
                }

                if (Array.isArray(res.data)) {
                    setData(res.data.map(normalizeProduct))
                } else {
                    setData([normalizeProduct(res.data)])
                }
                setLoading(false)
            },
            onError: (err) => {
                showError(err?.message || 'Ошибка загрузки товара')
                setData([])
                setLoading(false)
            }
        })
    }, [showError])

    return {
        data,
        loading,
        updating,
        getAllGoods,
        getGoodsByGuid,
        getGoodsByCategories,
        getRecommendation,
        getGoodsByGuids,
        updateGoods,
    }
}