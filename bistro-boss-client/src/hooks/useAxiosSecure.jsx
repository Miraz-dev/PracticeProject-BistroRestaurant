// import React from 'react';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create(
    {
        baseURL: "http://localhost:5000"
    }
)

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const {logOut} = useAuth()


    // const res = await axiosSecure.get("/users", {
    //     headers: {
    //         authorization: `Bearer ${localStorage.getItem("access-token")}`
    //     }
    // In req interceptor this is writiten as config.headers.authorization
    // This is sent to backend where verifyToken function recieves and access it as req.headers.authorization
    // });

    // Adding a request interceptor:
    axiosSecure.interceptors.request.use(function (config) {
        // Do somehting before request is sent:
        const token = localStorage.getItem("access-token");
        // console.log("Before req is sent by interceptors", token);
        config.headers.authorization = `Bearer ${token}`

        return config;
    }, function (error) {
        // Do something with request error
        

        return Promise.reject(error);
    })


    // Add a response interceptor
    axiosSecure.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, async (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        const status = error.response.status;
        console.log("Status error in the response interceptor: ", error);
        if(status === 401 || status === 403){
            await logOut();
            navigate("/login");
        }

        return Promise.reject(error);
    });



    return axiosSecure
};

export default useAxiosSecure;