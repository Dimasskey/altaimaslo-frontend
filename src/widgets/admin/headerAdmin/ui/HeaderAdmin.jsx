import React from 'react';

import Logo from "@shared/imges/svg/logo.svg"

import "./headerAdminStyles.scss"
import ButtonDefault from "@shared/buttons/ButtonDefault/ButtonDefault";
import {useNavigate} from "react-router-dom";




const HeaderAdmin = () => {

    const navigate = useNavigate();

    const handelGoMainPage = () => {
        navigate('/')
    }

    return (
        <>
            <header className="header_admin">
                <ButtonDefault text={"Вернуться на сайт"} classButton={"buttonBackInSite"} onClick={handelGoMainPage}/>
                <img src={Logo} className="header_admin-logo" alt="logo" />
            </header>
        </>
    );
};

export default HeaderAdmin;