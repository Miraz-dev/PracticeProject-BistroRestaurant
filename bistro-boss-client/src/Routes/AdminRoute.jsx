// import React from 'react';

import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({children}) => {
    const [isAdmin, isAdminLoading] = useAdmin();
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading || isAdminLoading){
        return <span className="loading loading-spinner loading-lg"></span>
    }

    if(user && isAdmin){
        return children;    
    }

    // const anotherExample = <Navigate to="/login" state={{from: location}} replace></Navigate>;
    return <Navigate to="/" state={{from: location}} replace></Navigate>
};

export default AdminRoute;