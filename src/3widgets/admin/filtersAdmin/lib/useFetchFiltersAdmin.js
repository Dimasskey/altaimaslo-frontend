import {useState, useEffect, useCallback} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useFetchFiltersAdmin = () => {
    const [filters, setFilters] = useState([])
    const [loading, setLoading] = useState(false)
    const {showError, showSuccess} = useStatusModal();

    const fetchFilters = useCallback(async () => {
        setLoading(true);
        RequestFetch({
            url: '/api/v1/measures',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    // Сортируем фильтры по order_number при загрузке
                    const sortedFilters = [...res.data].sort((a, b) =>
                        (a.order_number || 0) - (b.order_number || 0)
                    );
                    setFilters(sortedFilters);
                }
                setLoading(false);
            },
            onError: () => {
                showError('Не удалось загрузить фильтры');
                setLoading(false);
            }
        });
    }, [showError]);

    const addFilter = useCallback(async (filterData) => {
        setLoading(true);
        const maxOrder = filters.length > 0
            ? Math.max(...filters.map(f => f.order_number || 0))
            : 0;

        const dataWithOrder = {
            name: filterData.name,
            unit_measure: filterData.unit_measure || null,
            type_unit_measure: filterData.type_unit_measure || null,
            order_number: maxOrder + 1
        };

        RequestFetch({
            url: '/api/v1/measures',
            method: 'POST',
            body: dataWithOrder,
            onSuccess: async (res) => {
                if (res?.data) {
                    setFilters(prev => [...prev, res.data]);
                    showSuccess('Фильтр успешно добавлен');
                }
                setLoading(false);
            },
            onError: () => {
                showError('Не удалось добавить фильтр');
                setLoading(false);
            }
        });
    }, [showSuccess, showError, filters]);

    const updateFilter = async (filterId, filterData) => {
        return new Promise((resolve, reject) => {
            setLoading(true);

            const updatePayload = {
                name: filterData.name,
                unit_measure: filterData.unit_measure || null,
                type_unit_measure: filterData.type_unit_measure || null,
                order_number: filterData.order_number || 1
            };

            RequestFetch({
                url: `/api/v1/measures/${filterId}`,
                method: 'PATCH',
                body: updatePayload,
                onSuccess: async (res) => {
                    if (res?.data) {
                        setFilters(prev => prev.map(filter =>
                            filter.id === filterId ? { ...filter, ...res.data } : filter
                        ));
                        resolve(res.data);
                    } else {
                        reject(new Error('No data in response'));
                    }
                    setLoading(false);
                },
                onError: (error) => {
                    console.error('PATCH запрос ошибка:', error); // Добавляем лог
                    reject(error || new Error('Не удалось обновить фильтр'));
                    setLoading(false);
                }
            });
        });
    };

    const deleteFilter = async (filterId) => {
        setLoading(true);

        RequestFetch({
            url: `/api/v1/measures/${filterId}`,
            method: 'DELETE',
            onSuccess: async () => {
                setFilters(prev => prev.filter(filter => filter.id !== filterId));
                showSuccess('Фильтр успешно удален');
                setLoading(false);
            },
            onError: () => {
                showError('Не удалось удалить фильтр');
                setLoading(false);
            }
        });
    };

    const fetchMeasureById = useCallback(async (measureId) => {
        setLoading(true);

        try {
            const res = await RequestFetch({
                url: `/api/v1/measures/${measureId}`,
                method: 'GET',
                onSuccess: async (res) => {
                    setLoading(false);
                    return res.data;
                },
                onError: () => {
                    showError(`Не удалость загрузить характеристику ${measureId}`);
                    setLoading(false);
                    return null;
                }
            });
            return res?.data;
        } catch (err) {
            showError(`Ошибка при загрузке характеристики ${measureId}`);
            setLoading(false);
            return null;
        }
    }, [showError]);

    useEffect(() => {
        fetchFilters();
    }, []);

    return {
        filters,
        loading,
        fetchFilters,
        addFilter,
        updateFilter,
        deleteFilter,
        fetchMeasureById,
    };
};