import React, {useState} from 'react';

import "./loginForm.scss"

import logo from "@shared/imges/svg/logo.svg"
import emptyCart from '@shared/imges/svg/emptyCart.svg'
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useLogin} from "@/features/auth/lib/hooks/useLogin";

import { validateEmail, validatePassword, validateLoginForm, validateForgotPasswordForm } from "@shared/utils/validate";
import {useStatusModal} from "@/app/providers/statusModalProvider/statusModalProvider";
import {useResetPassword} from "@/features/auth/lib/hooks/useResetPassword";

const LoginForm = ({closeModal, setModalClass, resetModalState}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const { handleReset, loading: resetLoading} = useResetPassword()
    const { handleLogin, loading} = useLogin()
    const { showSuccess, showError, showInfo} = useStatusModal()

    const validateForm = () => {
        let validationResult;

        if (isForgotPassword) {
            validationResult = validateForgotPasswordForm(email)
        } else {
            validationResult = validateLoginForm(email, password)
        }

        setEmailError(validationResult.errors.email || '')
        setPasswordError(validationResult.errors.password || '')

        return validationResult.isValid
    }

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (emailError && validateEmail(value)) {
            setEmailError('')
        }
    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (passwordError && validatePassword(value)) {
            setPasswordError('');
        }
    }

    const handleForgotPassword = () => {
        setIsForgotPassword(true)
        setPasswordError('')
        setModalClass('reduced')
    }

    const handleBackToLogin = () => {
        setIsForgotPassword(false)
        setModalClass('')
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return;
        if (isForgotPassword) {
            const result = await handleReset(email)

            if (result.success) {
                handleBackToLogin()
            }
            return;
        }
        const result = await handleLogin(email, password);

        if (result?.success) {
            showSuccess(
                result.message || "Авторизация успешна!",
                'Успех!',
                {
                    onClose: () => {
                        resetModalState()
                        closeModal()

                        showInfo("Если доставка на следующий день, то заявка принимается до 15:00", '', {
                            image: emptyCart
                        })
                    }
                }
            )
        }
    }


    return (
        <>
            <form className="login-form" onSubmit={onSubmit}>
                <img className="login-form__logo" src={logo} alt={""}/>
                <input
                    type="email"
                    className="login-form__email"
                    placeholder={`Электронная почта`}
                    value={email}
                    required
                    autoComplete={'username'}
                    onChange={handleEmailChange}
                    disabled={loading}
                />

                <span className={`login-form__error ${emailError ? "login-form__error-visible" : ""}`}>
                    {emailError}
                </span>


                <div className={`login-form__password-field ${isForgotPassword ? 'login-form__password-field--hidden' : ''}`}>
                    <input
                        type="password"
                        className="login-form__password"
                        placeholder="Пароль"
                        value={password}
                        required={!isForgotPassword}
                        autoComplete={'current-password'}
                        onChange={handlePasswordChange}
                        maxLength={10}
                        disabled={loading}
                    />

                    <span className={`login-form__error ${passwordError ? "login-form__error-visible" : ""}`}>
                        {passwordError}
                    </span>
                </div>
                {!isForgotPassword ? (
                    <>
                        <div className="login-form__forgot">
                            <button
                                onClick={handleForgotPassword}
                                type="button"
                                className="login-form__forgot-button"
                            >
                                Забыли пароль?
                            </button>
                        </div>


                        <ButtonDefault
                            text={`${loading ? "Загрузка..." : 'Войти'}`}
                            classButton={"login-form__submit"}
                            onClick={onSubmit}
                        />
                    </>
                ) : (
                    <>
                        <div className="login-form__forgot">
                            <button
                                onClick={handleBackToLogin}
                                type="button"
                                className="login-form__forgot-button"
                            >
                                Вернуться к логину
                            </button>
                        </div>


                        <ButtonDefault
                            text={`${loading ? "Отправка..." : 'Отправить'}`}
                            classButton={"login-form__submit"}
                            onClick={onSubmit}
                        />
                    </>
                )}
            </form>
        </>
    );
};

export default LoginForm;