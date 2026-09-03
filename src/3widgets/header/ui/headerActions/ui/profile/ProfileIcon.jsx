import React from 'react';
import ProfileIconSvg from "@shared/imges/svg/profile.svg?react";
import {NavLink} from "react-router-dom";
import {PROFILE} from "@shared/constants/constatns";

const ProfileIcon = () => {
    return (
        <NavLink className="header-profile" to={PROFILE}>
            <ProfileIconSvg className="header-profile__icon" />
            <span className="header-profile__text">Профиль</span>
        </NavLink>
    );
};

export default ProfileIcon;