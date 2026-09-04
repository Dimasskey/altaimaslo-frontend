import React from 'react';
import {Link, useLocation} from "react-router-dom";

import "./asideMenuProfile.scss"
import {useAuth} from "@/app/providers/authProvider/authProvider";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import Profile from "@shared/imges/svg/profile.svg?react";

const AsideMenuProfile = ({onClose}) => {
    const location = useLocation()
    const {logout} = useAuth()
    const isMobile = useIsMobile()

    const menuItems = [
        { id: 'orders', label: 'Мои заказы', path: '/profile/orders' },
        { id: 'favorites', label: 'Избранное', path: '/profile/favorites' },
        { id: 'addresses', label: 'Адреса доставки', path: '/profile/addresses' },
        { id: 'account', label: 'Учётная запись', path: '/profile/account' }
    ];

    const isActive = (path) => {
        if (location.pathname === '/profile/*' && path === '/profile/orders') {
            return true;
        }
        return location.pathname.startsWith(path);
    }

    const handleLogout = () => {
        logout();
        if (isMobile) onClose()
    }

    return (
        <div className={'profile-sidebar'}>
            <div className={'profile-sidebar__header'}>
                {isMobile ? (
                    <><Profile className="profile-sidebar__header-icon" /> <span>Профиль</span></>
                ) : 'Личный кабинет'}
            </div>
            <nav className={'profile-sidebar__menu'}>
                {menuItems.map(item => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className={'profile-sidebar__logout'} onClick={handleLogout}>
                Выйти
            </div>
        </div>
    );
};

export default AsideMenuProfile;