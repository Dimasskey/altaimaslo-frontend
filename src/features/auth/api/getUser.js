import {RequestFetch} from "@shared/api/requestFetch";

export async function getUser() {
    return new Promise((resolve) => {
        RequestFetch({
            url: '/api/v1/users/me',
            method: 'GET',
            onSuccess: (data) => resolve(data),
            onError: (error) => {
                if (error?.status === 401) {
                    resolve(null)
                } else {
                    console.warn('Ошибка загрузки пользователя', error)
                    resolve(null)
                }
            }

        })
    })
}