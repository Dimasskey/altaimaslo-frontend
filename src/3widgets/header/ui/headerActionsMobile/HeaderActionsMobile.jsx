import React from 'react';

import Search from '@shared/imges/svg/searchSvg.svg?react'
import Profile from '@shared/imges/svg/profile.svg?react'
import Cart from '@shared/imges/svg/cart.svg?react'
import Login from '@shared/imges/svg/login.svg?react'
import {useAuth} from "@/1app/providers/authProvider/authProvider";

import './headerActionsMobile.scss'
import {NavLink} from "react-router-dom";
import {CART} from "@shared/constants/constatns";
import {useModalWithClass} from "@shared/hooks/modal/useModalWithClass";
import LoginModal from "@/4features/auth/ui/LoginModal/LoginModal";
import {useStore} from "@shared/providers/StoreProvider";

const HeaderActionsMobile = ({onSearchClick, onProfileClick}) => {
    const {user, loading} = useAuth()
    const { isOpen, openModal, closeModal, modalClass, setModalClass, resetModalClass} = useModalWithClass();
    const {cartItems} = useStore();
    const itemsCount = cartItems.length


    return (
        <div className={'header-actions-mobile'}>
            <Search className={'actions-mobile__search'} onClick={onSearchClick}/>
            {user ? <Profile onClick={onProfileClick} className={'actions-mobile__profile'} /> : <Login onClick={openModal} className={'actions-mobile__login'} />}
            {user ? <NavLink className={'header-cart'} to={CART}>
                {itemsCount > 0 && (
                    <div className={"header-cart__count"}>{itemsCount}</div>
                )}
                <Cart className={'actions-mobile__cart'}/>
            </NavLink> : null}

            <LoginModal
                onClose={closeModal}
                setModalClass={setModalClass}
                resetModalClass={resetModalClass}
                isOpen={isOpen}
                modalClass={modalClass}
            />
        </div>
    );
};

export default HeaderActionsMobile;