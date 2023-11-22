// import React from 'react';
// enabled: set this to false to disable the query from automatically running.

import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {

    const {user, loading} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: isAdmin, isPending: isAdminLoading} = useQuery({
        queryKey: [user?.email, "isAdmin"],
        enabled: !loading, // When loading is true it will enable. So put ! before loading. 
        // This ensure that when everything is loaded it becomes false in AuthProvider.jsx. 
        // And in here, becasue of ! the loading here become true and hence enabled is true and query fn() is launched.
        queryFn: async()=> {
            const res = await axiosSecure(`/users/admin/${user.email}`);
            console.log("From useAdmin: ", res.data);
            return res.data?.admin;
        }
    });

    return [isAdmin, isAdminLoading];
};

export default useAdmin;