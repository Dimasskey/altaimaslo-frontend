import React from 'react';
import {useAuth} from "@/app/providers/authProvider/authProvider";
import {Navigate} from "react-router-dom";

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth()

    if (loading) {
        return null;
    }

    if (!user || !user?.is_admin) {
        return <Navigate to='/' replace/>
    }

    return children
};

export default AdminRoute;