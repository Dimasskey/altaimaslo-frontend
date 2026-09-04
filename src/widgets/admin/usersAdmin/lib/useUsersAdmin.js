import {useState, useEffect} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useUsersAdmin = () => {
    const [users, setUsers] = useState(null)
    const [loading, setLoading] = useState(false)
    const {showError} = useStatusModal();

    const fetchUsers = async () => {
        setLoading(true);

        RequestFetch({
            url: '/api/v1/users',
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setUsers(res?.data)
                }
                setLoading(false)
            },
            onError: () => {
                showError('Не удалось загрузить пользователей');
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchUsers()
    }, []);

    return {
        users,
        loading,
        fetchUsers,
    }
}