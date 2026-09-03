import React from 'react';
import FavoriteIcon from "./ui/favorite/FavoriteIcon.jsx";
import LoginIcon from "./ui/login/LoginIcon.jsx";
import ProfileIcon from "./ui/profile/ProfileIcon.jsx";
import CartIcon from "./ui/cart/CartIcon.jsx";

import "./headerActions.css"
import {useAuth} from "@/1app/providers/authProvider/authProvider";
import LoginForm from "@/4features/auth/ui/LoginForm/LoginForm";
import Modal from "@shared/ui/Modal/Modal";
import {useModalWithClass} from "@shared/hooks/modal/useModalWithClass";
import LoginModal from "@/4features/auth/ui/LoginModal/LoginModal";


const HeaderActions = () => {
    const {user, loading} = useAuth()
    const { isOpen, openModal, closeModal, modalClass, setModalClass, resetModalClass} = useModalWithClass();

    return (
        <div className={`header-actions ${loading ? "loading" : "loaded"}`}>

            {user ? (
                <>
                    <FavoriteIcon/>
                    <ProfileIcon/>
                    <CartIcon/>
                </>
                ) :
                <>
                    <LoginIcon openModal={openModal}/>
                </>
            }

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

export default HeaderActions;