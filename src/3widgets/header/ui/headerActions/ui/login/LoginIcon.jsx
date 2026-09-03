import React from 'react';

import LoginIconSvg from "@shared/imges/svg/login.svg?react"

const LoginIcon = ({openModal}) => {
    return (
        <>
            <div className="header-login" onClick={openModal}>
                <LoginIconSvg className="header-login__icon" />
                <span className="header-login__text">Войти</span>
            </div>
        </>
    );
};

export default LoginIcon;