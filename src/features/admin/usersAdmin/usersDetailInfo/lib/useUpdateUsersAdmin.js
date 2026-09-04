import {useState} from "react";
import {RequestFetch} from "@shared/api/requestFetch";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";

export const useUpdateUsersAdmin = () => {
    const [loading, setLoading] = useState(false);
    const {showSuccess, showError} = useStatusModal();

    const updateUser = async (userData) => {
        setLoading(true);

        const requestData = {
            organization: userData.organization || '',
            inn: userData.inn || null,
            kpp: userData.kpp || null,
            phone_number: userData.phone_number || '',
            email: userData.email || null,
            legal_address: userData.legal_address || '',
            password: userData.password || ''
        };


        return new Promise((resolve, reject) => {
            let url = `/api/v1/users/${userData.guid}`
            RequestFetch({
                url: url,
                method: 'PATCH',
                body: requestData,
                onSuccess: (res) => {
                    showSuccess('Данные пользователя успешно обновлены');
                    setLoading(false);
                    resolve(res?.data);
                },
                onError: (error) => {
                    const errorMessage = error?.message || 'Не удалось обновить данные пользователя';
                    showError(errorMessage);
                    setLoading(false);
                    reject(error);
                }
            });
        });
    };

    return {
        updateUser,
        loading
    };
};