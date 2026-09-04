import {RequestFetch} from "@shared/api/requestFetch";

export async function resetPassword(email) {
    return new Promise((resolve, reject) => {
        RequestFetch({
            url: '/api/v1/auth/reset',
            method: 'PATCH',
            body: {email},
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(new Error (error?.message || 'Ошибка сброса пароля'))
        })
    })
}
