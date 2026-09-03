import {RequestFetch} from "@shared/api/requestFetch";

export async function logoutUser() {
    return new Promise((resolve,reject) => {
        RequestFetch({
            url: '/api/v1/auth/logout',
            method: 'POST',
            onSuccess: (data) => {
                resolve(data)
            },
            onError: (error) => {
                reject(new Error(error?.message || 'Ошибка выхода.'))
            }
        })
    })
}