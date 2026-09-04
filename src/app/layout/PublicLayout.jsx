import React from 'react';
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";
import TopLink from "@/widgets/topLink/TopLink";
import Header from "@/widgets/header/ui/Header";
import {Outlet} from "react-router-dom";

const PublicLayout = () => {
    const isMobile = useIsMobile()
    return (
        <>
            {!isMobile && <TopLink />}
            <Header />
            <Outlet />
        </>
    );
};

export default PublicLayout;