    import {useEffect, useState} from "react";
    import {RequestFetch} from "@shared/api/requestFetch";
    import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

    export function useAddresses(isModerated = null) {
        const {showSuccess, showError} = useStatusModal()
        const [addresses, setAddresses] = useState([])
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            let url = '/api/v1/users_delivery_points';
            if (isModerated) {
                url += '?is_moderated=true';
            }
            RequestFetch({
                url,
                method: 'GET',
                onSuccess: (res) => {
                    if (res?.data) {
                        setAddresses(res.data)
                    } else {
                        showError(res?.message || 'Адреса не найдены');
                        setAddresses([])
                    }
                    setLoading(false)
                },
                onError: (err) => {
                    showError(err?.message || 'Не удалось загрузить адреса');
                    setAddresses([])
                    setLoading(false)
                },
            })
        },[showError])

        const removeAddress = (guid) => {
            return new Promise((resolve, reject) => {
                RequestFetch({
                    url: `/api/v1/users_delivery_points/${guid}`,
                    method: 'DELETE',
                    onSuccess: (res) => {
                        setAddresses(prev => prev.filter(addr => addr.guid !== guid));
                        resolve(res)
                    },
                    onError: (err) => {
                        showError(err?.message || "Не удалось удалить адрес")
                        reject(err)
                    }
                })
            })
        }

        const addAddress = (addressData) => {
            return new Promise((resolve, reject) => {
                RequestFetch({
                    url: `/api/v1/users_delivery_points`,
                    method: 'POST',
                    body: addressData,
                    onSuccess: (res) => {
                        showSuccess(res?.message || 'Адрес успешно добавлен');
                        setAddresses(prev => [...prev, res.data])
                        resolve(res);
                    },
                    onError: (err) => {
                        showError(err?.message || 'Не удалось добавить адрес')
                        reject(err)
                    }
                })
            })
        }

        const getAddress = (guid) => {
            return new Promise((resolve, reject) => {
                RequestFetch({
                    url: `/api/v1/users_delivery_points/${guid}`,
                    method: 'GET',
                    onSuccess: (res) => {
                        resolve(res.data);
                    },
                    onError: (err) => {
                        showError(err?.message || 'Не удалось получить адрес')
                        reject(err)
                    }
                })
            })
        }

        const updateAddress = (guid, addressData) => {
            return new Promise((resolve, reject) => {
                RequestFetch({
                    url: `/api/v2/users_delivery_points/${guid}`,
                    method: 'PATCH',
                    body: addressData,
                    onSuccess: (res) => {
                        showSuccess(res?.message || 'Адрес успешно обнавлен')
                        setAddresses(prev =>
                            prev.map(addr => addr.guid === guid ? { ...addr, ...res.data } : addr)
                        )
                        resolve(res);
                    },
                    onError: (err) => {
                        showError(err?.message || 'Не удалось обновить адрес')
                        reject(err)
                    }
                })
            })
        }

        return {
            addresses,
            loading,
            removeAddress,
            addAddress,
            updateAddress,
            getAddress
        }

    }