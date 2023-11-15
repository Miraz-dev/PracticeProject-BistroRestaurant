// import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Pages/Shared/Footer/Footer';
import Navbar from '../Pages/Shared/Navbar/Navbar';

const RootMain = () => {

    const location = useLocation();
    // console.log("Current Location: ", location);
    const noHeaderFooter = location.pathname.includes("login") || location.pathname.includes("signup");


    return (
        <div className=''>
            {noHeaderFooter || <Navbar></Navbar>}
            <Outlet></Outlet>
            {noHeaderFooter || <Footer></Footer>}
        </div>
    );
};

export default RootMain;