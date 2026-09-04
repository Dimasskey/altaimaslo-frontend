import {useState, useEffect} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useFetchUsersDeliveryPointsAdmin = () => {
    const [usersDeliveryPoints, setUsersDeliveryPoints] = useState(null)
    const [loading, setLoading] = useState(false)
    const {showError} = useStatusModal();

    const fetchUsersDeliveryPoints = async () => {
        setLoading(true);

        RequestFetch({
            url: '/api/v1/users_delivery_points/admin',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setUsersDeliveryPoints(res?.data)
                }
                setLoading(false)
            },
            onError: () => {
                showError('Не удалось загрузить адрес доставки');
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchUsersDeliveryPoints()
    }, []);

    return {
        usersDeliveryPoints,
        loading,
        fetchUsersDeliveryPoints,
    }
}