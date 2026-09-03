import React from 'react';
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import HeaderMobile from "@/3widgets/header/ui/HeaderMobile";
import HeaderDesktop from "@/3widgets/header/ui/HeaderDesktop";

const Header = () => {
    const isMobile = useIsMobile()

    return isMobile ? <HeaderMobile /> : <HeaderDesktop />
};

export default Header;