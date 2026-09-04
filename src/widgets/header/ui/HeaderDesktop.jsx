import React, {useRef, useState} from 'react';

import BurgerCategories from "./burgerCategories/ui/BurgerCategories.jsx";
import SearchHeader from "./seacrhHeader/ui/SearchHeader.jsx";
import HeaderActions from "./headerActions/HeaderActions.jsx";

import Logo from "@shared/imges/svg/logo.svg"

import "./headerStyles.scss"
import {NavLink} from "react-router-dom";
import {MAIN} from "@shared/constants/constatns";
import CategoriesDropdown from "@/widgets/header/ui/categoriesDropdown/CategoriesDropdown";




const HeaderDesktop = () => {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
    const closeTimeoutRef = useRef(null);

    const openCategories = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsCategoriesOpen(true)
    }

    const closeCategoriesWithDelay = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsCategoriesOpen(false)
        }, 250)
    }

    return (
        <div className={'header-wrapper'}>
            <header className="header" >
                <NavLink to={MAIN}><img src={Logo} className="header-logo" alt="logo"/></NavLink>
                <div
                    className={'header-burger-wrapper'}
                    onMouseEnter={openCategories}
                    onMouseLeave={closeCategoriesWithDelay}
                >
                    <BurgerCategories withText={true}/>
                </div>
                <SearchHeader/>
                <HeaderActions/>
            </header>
            <div
                className={`header-categories-panel ${isCategoriesOpen ? 'open' : ''}`}
                onMouseEnter={openCategories}
                onMouseLeave={closeCategoriesWithDelay}
            >
                <CategoriesDropdown onClose={() => setIsCategoriesOpen(false)} />
            </div>
        </div>
    );
};

export default HeaderDesktop;