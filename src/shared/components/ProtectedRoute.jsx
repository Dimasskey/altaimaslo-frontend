import React from 'react';
import {useAuth} from "@/app/providers/authProvider/authProvider";
import {Navigate} from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {user, loading} = useAuth()

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to='/' replace/>
    }

    return children
};

export default ProtectedRoute;