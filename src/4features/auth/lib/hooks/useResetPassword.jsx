import {useStatusModal} from "@/1app/providers/statusModalProvider/statusModalProvider";
import {useState} from "react";
import {resetPassword} from "@/4features/auth/api/resetPassword";

export const useResetPassword = () => {
    const {showSuccess, showError} = useStatusModal()
    const [loading, setLoading] = useState(false)

    const handleReset = async (email) => {
        setLoading(true)

        try {
            const result = await resetPassword(email);
            showSuccess(
                result.message || `Инструкция по сбросу отправлена на ${email}`,
                'Пароль сброшен'
            );
            return {success: true};
        } catch (err) {
            showError(
                err.message || 'Ошибка сброса пароля',
            );
            return {success: false}
        } finally {
            setLoading(false)
        }
    }

    return {handleReset, loading}
}