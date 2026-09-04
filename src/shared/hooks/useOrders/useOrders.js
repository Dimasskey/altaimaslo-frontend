
import { useEffect, useState } from "react";
import { RequestFetch } from "@shared/api/requestFetch";

export const useOrders = (addressGuid = null) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ По умолчанию true
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);

            const url = `/api/v1/orders${addressGuid === null ? '' : `?users_delivery_points_guid=${addressGuid}`}`;

            try {
                await RequestFetch({
                    url: url,
                    method: "GET",
                    onSuccess: (data) => {
                        const formattedOrders = data.data.map((item) => ({
                            id: item.guid,
                            date: item.datetime_create,
                            orderNumber: item.number_order || '-',
                            status_id: item.status.id,
                            status_name: item.status.name,
                            status_color: item.status.color,
                            amount: `${item.sum} ₽`,
                        }));
                        setOrders(formattedOrders);
                    },
                    onError: (error) => {
                        setError(error.message);
                    },
                });
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [addressGuid]);

    return { orders, loading, error };
};