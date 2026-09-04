import { useState } from "react";
import { RequestFetch } from "@shared/api/requestFetch";

export function useTypePrices() {
    const [typePrices, setTypePrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function getAllTypePrices() {
        setLoading(true);
        setError(null);

        RequestFetch({
            url: '/api/v1/type_prices',
            method: 'GET',
            onSuccess: (response) => {
                setTypePrices(response.data || []);
                console.log("response",response);
                setLoading(false);
            },
            onError: (errorData) => {
                setError(errorData);
                setLoading(false);
            }
        });
    }

    function getTypePriceById(id_type_prices) {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            RequestFetch({
                url: `/api/v1/type_prices/${id_type_prices}`,
                method: 'GET',
                onSuccess: (response) => {
                    setLoading(false);
                    resolve(response.data);
                },
                onError: (errorData) => {
                    setError(errorData);
                    setLoading(false);
                    reject(errorData);
                }
            });
        });
    }

    function getUserTypePrice(user_guid) {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            RequestFetch({
                url: `/api/v1/type_prices/users/${user_guid}`,
                method: 'GET',
                onSuccess: (response) => {
                    setLoading(false);
                    resolve(response.data);
                },
                onError: (errorData) => {
                    setError(errorData);
                    setLoading(false);
                    reject(errorData);
                }
            });
        });
    }

    function setUserTypePrice(id_type_prices, user_guid) {
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            RequestFetch({
                url: `/api/v1/type_prices/${id_type_prices}/users/${user_guid}`,
                method: 'PATCH',
                onSuccess: (response) => {
                    setLoading(false);
                    resolve(response.data);
                },
                onError: (errorData) => {
                    setError(errorData);
                    setLoading(false);
                    reject(errorData);
                }
            });
        });
    }

    return {
        typePrices,
        loading,
        error,
        getAllTypePrices,
        getTypePriceById,
        getUserTypePrice,
        setUserTypePrice,
    };
}