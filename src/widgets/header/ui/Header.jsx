import React from 'react';
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import HeaderMobile from "@/widgets/header/ui/HeaderMobile";
import HeaderDesktop from "@/widgets/header/ui/HeaderDesktop";

const Header = () => {
    const isMobile = useIsMobile()

    return isMobile ? <HeaderMobile /> : <HeaderDesktop />
};

export default Header;