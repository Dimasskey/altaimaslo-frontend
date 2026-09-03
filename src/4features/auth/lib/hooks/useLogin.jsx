import React, {useState} from 'react';
import {loginUser} from "@/4features/auth/api/login";
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import {getUser} from "@/4features/auth/api/getUser";
import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";

export const useLogin = () => {
    const {setUser} = useAuth();
    const {showError} = useStatusModal();
    const [loading, setLoading] = useState(false);


    const handleLogin = async (email, password) => {
        setLoading(true)

        try {
            const loginData = await loginUser({email,password})
            const userData = await getUser();
            setUser(userData?.data || null);
            return {success: true, message: loginData.message};
        } catch (err) {
            const errorMessage = err.message || 'Ошибка авторизации';
            showError(errorMessage, 'Ошибка авторизации');
            return {success: false, error: errorMessage };
        } finally {
            setLoading(false)
        }
    }

    return {handleLogin, loading}
}