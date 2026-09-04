import {RequestFetch} from "@shared/api/requestFetch";

export async function loginUser({email, password}) {
    return new Promise((resolve, reject) => {
        RequestFetch({
            url: '/api/v1/auth/login',
            method: "POST",
            body: {email, password},
            onSuccess: (data) => resolve(data),
            onError: (error) => reject(new Error(error?.message || 'Ошибка авторизации'))
        })
    })
}