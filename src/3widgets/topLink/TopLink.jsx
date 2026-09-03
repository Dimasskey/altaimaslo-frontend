import React from 'react';

import "./topLink.scss"
import {NavLink} from "react-router-dom";
import {ADMIN_PANEL, INFORMATION} from "@shared/constants/constatns";
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const TopLink = ({isOpen = false}) => {
    const {user} = useAuth()
    const isMobile = useIsMobile()
    const isAdmin = user?.is_admin === true;

    return (
        <div className="toplink">
            {!isMobile && isAdmin && (<NavLink className="toplink__link" to={ADMIN_PANEL}>Админ панель</NavLink>)}
            <div className={`toplink-top ${isMobile ? 'mobile' : ''}`}>
                <NavLink to={`${INFORMATION}/2`} className="toplink__link">О компании</NavLink>
                <NavLink to={`${INFORMATION}/1`} className="toplink__link">Бесплатная доставка</NavLink>
            </div>
            <a href="tel:+73854255600" className="toplink__link">8 385 425 56 00</a>
        </div>
    );
};

export default TopLink;