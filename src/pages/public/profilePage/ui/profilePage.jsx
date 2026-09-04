import React from 'react';
import AsideMenuProfile from "@/widgets/profile/ui/asideMenuProfile/ui/AsideMenuProfile";
import {Outlet} from "react-router-dom";
import {useIsMobile} from "@shared/hooks/useIsMobile/useIsMobile";

const ProfilePage = () => {
    const isMobile = useIsMobile()

    return (
        <>
            <div className={'profile-container'}>
                {!isMobile && <AsideMenuProfile />}
                <Outlet />
            </div>
        </>
    );
};

export default ProfilePage;