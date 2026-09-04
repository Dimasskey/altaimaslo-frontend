import React, { useEffect } from 'react';
import {Outlet} from "react-router-dom";
import HeaderAdmin from "@/widgets/admin/headerAdmin/ui/HeaderAdmin";
import AsideMenuAdmin from "@/widgets/admin/asideMenuAdmin/ui/AsideMenuAdmin";

import "./adminPagesStyles.scss"


const AdminPages = () => {

    useEffect(() => {

        document.body.classList.add('body-admin');

        return () => {
            document.body.classList.remove('body-admin');
        };

    }, []);

    return (
        <div className={"admin_page"}>
            <HeaderAdmin />
            <div className={"admin_page-body"}>
                <div style={{ display: "flex", gap: "2vw", flexDirection: "column" }}>
                    <AsideMenuAdmin />
                </div>
                <div className={"admin_page-content"}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminPages;