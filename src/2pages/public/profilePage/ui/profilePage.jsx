import React from 'react';
import TopLink from "@/3widgets/topLink/TopLink";
import Header from "@/3widgets/header/ui/Header";
import AsideMenuProfile from "@/3widgets/profile/ui/asideMenuProfile/ui/AsideMenuProfile";
import {Outlet} from "react-router-dom";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const ProfilePage = () => {
    const isMobile = useIsMobile()

    return (
        <>
            {/*{!isMobile &&  <TopLink />}*/}
            {/*<Header />*/}
            <div className={'profile-container'}>
                {!isMobile && <AsideMenuProfile />}
                <Outlet />
            </div>
        </>
    );
};

export default ProfilePage;