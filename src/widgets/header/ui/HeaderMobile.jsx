import React, {useEffect, useState} from 'react';
import BurgerCategories from "@/widgets/header/ui/burgerCategories/ui/BurgerCategories";
import Logo from "@shared/imges/svg/logo.svg"

import './headerMobile.scss'
import HeaderActionsMobile from "@/widgets/header/ui/headerActionsMobile/HeaderActionsMobile";
import MobileSideDrawer from "@shared/ui/MobileSideDrawer/MobileSideDrawer";
import CategoriesDropdown from "@/widgets/header/ui/categoriesDropdown/CategoriesDropdown";
import SearchHeader from "@/widgets/header/ui/seacrhHeader/ui/SearchHeader";
import AsideMenuProfile from "@/widgets/profile/ui/asideMenuProfile/ui/AsideMenuProfile";
import {NavLink, useLocation} from "react-router-dom";
import {MAIN} from "@shared/constants/constatns";
import TopLink from "@/widgets/topLink/TopLink";

const HeaderMobile = () => {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {
        setIsProfileOpen(false)
    }, [location]);

    return (
        <div className={'header-mobile'}>

            <div className={`header-mobile-content ${isSearchOpen ? 'hide' : ''}`}>
                <div className={'header-mobile-left'}>
                    <div onClick={() => setIsCategoriesOpen(true)}>
                        <BurgerCategories withText={false}/>
                    </div>
                    <NavLink to={MAIN}><img src={Logo} className={'header-mobile__logo'}/></NavLink>
                </div>
                <div className={'header-mobile-right'}>
                    <HeaderActionsMobile
                        onSearchClick={() => setIsSearchOpen(true)}
                        onProfileClick={() => setIsProfileOpen(true)}
                    />
                </div>
            </div>



            <div className={`header-mobile-search ${isSearchOpen ? 'show' : ''}`}>
                <SearchHeader isSearchOpen={isSearchOpen} onCloseSearch={() => setIsSearchOpen(false)} />
            </div>

            <MobileSideDrawer side={'left'} isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)}>
                <CategoriesDropdown onClose={() => setIsCategoriesOpen(false)}/>
                <TopLink isOpen={true}/>
            </MobileSideDrawer>

            <MobileSideDrawer side={'right'} isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}>
                <AsideMenuProfile onClose={() => setIsProfileOpen(false)} />
            </MobileSideDrawer>

        </div>
    );
};

export default HeaderMobile;