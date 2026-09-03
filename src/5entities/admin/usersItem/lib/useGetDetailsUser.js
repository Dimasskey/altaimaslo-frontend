import {useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useGetDetailsUser = () => {
    const [usersDetails, setUsersDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const {showError} = useStatusModal();

    const fetchUserDetails = async (user_guid) => {
        if (!user_guid) return;

        setLoading(true);

        let url = `/api/v1/users/${user_guid}`;
        RequestFetch({
            url: url,
            method: 'GET',
            onSuccess: async (res) => {
                if (res?.data) {
                    setUsersDetails(res?.data)
                }
                setLoading(false)
            },
            onError: () => {
                showError('Не удалось загрузить данные пользователя');
                setLoading(false)
            }
        })
    }

    return {
        usersDetails,
        loading,
        fetchUserDetails,
    }
}