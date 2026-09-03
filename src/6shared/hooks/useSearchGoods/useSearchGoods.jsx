import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import {useCallback, useEffect, useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";

export function useSearchGoods(categoriesId, searchText, filtersBody = [], order = '') {
    const {showError} = useStatusModal()
    const [goods, setGoods] = useState([])
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [limit] = useState(20)
    const [offset, setOffset] = useState(0)

    const fetchGoodsDirectly = useCallback(async (currentOffset = 0) => {
        setLoading(true);

        const queryParams = new URLSearchParams()
        if (categoriesId) queryParams.append('categories_id', categoriesId)
        if (searchText) queryParams.append('text', searchText)
        if (order) queryParams.append('order', order)
        queryParams.append('limit', limit.toString())

        queryParams.append('offset', currentOffset.toString())

        const body = filtersBody.length > 0 ? filtersBody : undefined;

        return new Promise((resolve, reject) => {
            RequestFetch({
                url: `/api/v2/goods/search?${queryParams.toString()}`,
                method: 'POST',
                body: body,
                onSuccess: (res) => {
                    const data = res?.data || [];
                    if (currentOffset === 0) {
                        setGoods(data);
                    } else {
                        setGoods(prev => [...prev, ...data]);
                    }

                    setCount(res?.count || 0);
                    setLoading(false);
                    setLoadingMore(false);
                    resolve(data);
                },
                onError: (err) => {
                    showError(err?.message || "Не удалось загрузить товары")
                    if (currentOffset === 0) {
                        setGoods([]);
                        setCount(0);
                    }
                    setLoading(false)
                    setLoadingMore(false)
                    reject(err);
                }
            })
        });

    }, [categoriesId, searchText, filtersBody, order, limit, showError])

    useEffect(() => {
        setOffset(0);
        fetchGoodsDirectly(0);
    }, [categoriesId, searchText, filtersBody, order, fetchGoodsDirectly])

    const loadMore = useCallback(() => {
        if (loading || loadingMore) return
        if (goods.length >= count) return;

        setLoadingMore(true)

        const nextOffset = offset + limit;

        setOffset(nextOffset);
        fetchGoodsDirectly(nextOffset);

    }, [loading, loadingMore, goods.length, count, limit, offset, fetchGoodsDirectly])

    return {
        goods,
        count,
        loading,
        loadingMore,
        loadMore,
        fetchGoodsDirectly: () => fetchGoodsDirectly(0)
    }
}