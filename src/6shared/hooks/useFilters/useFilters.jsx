import {useCallback, useEffect, useMemo, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {RequestFetch} from "@shared/api/requestFetch";

export function useFilters(categoriesId, searchText) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState([])
    const [loading, setLoading] = useState(false)

    const selectedFilters = useMemo(() => {
        const filtersParam = searchParams.get("filters");

        if (!filtersParam) return [];

        return filtersParam.split(";").map(group => {
            const [id, values] = group.split(":");

            return {
                id: Number(id),
                values: values.split(',')
            }
        })
    }, [searchParams]);

    const loadFilters = useCallback(async () => {
        if (!categoriesId && !searchText) {
            setFilters([])
            return;
        }

        setLoading(true)
        const queryParams = new URLSearchParams()
        if (categoriesId) queryParams.append('categories_id', categoriesId)
        if (searchText) queryParams.append('text', searchText)

        try {
            const data = await new Promise((resolve, reject) => {
                RequestFetch({
                    url: `/api/v1/filters?${queryParams.toString()}`,
                    method: 'POST',

                    onSuccess: (res) => {
                        resolve(res?.data || [])
                    },

                    onError: (err) => {
                        reject(err)
                    }
                })
            })

            setFilters(data)
        } catch (err) {
            console.error(err)
            setFilters([])
        } finally {
            setLoading(false)
        }
    }, [categoriesId, searchText])

    useEffect(() => {
        loadFilters();
    }, [categoriesId, searchText, loadFilters])

    const handleFilterChange = useCallback((filterId, value, isChecked) => {
        const newFilters = [...selectedFilters]
        let filter = newFilters.find(f => f.id === filterId)

        if (!filter) {
            filter = {id: filterId, values: []}
            newFilters.push(filter)
        }

        if (isChecked) {
            if (!filter.values.includes(value)) {
                filter.values.push(value)
            }
        } else {
            filter.values = filter.values.filter(v => v !== value)
        }

        const cleaned = newFilters.filter(f => f.values.length > 0)

        setSearchParams(prev => {
            const params = new URLSearchParams(prev);

            if (!cleaned.length) {
                params.delete("filters");
            } else {
                const value = cleaned
                    .map(f => `${f.id}:${f.values.join(',')}`)
                    .join(";");

                params.set('filters', value)
            }

            return params;
        })
    }, [selectedFilters])

    const clearFilters = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        params.delete("filters");

        setSearchParams(params, {replace: true})
    }, [searchParams])

    return {
        filters,
        selectedFilters,
        handleFilterChange,
        clearFilters,
        loading
    }
}