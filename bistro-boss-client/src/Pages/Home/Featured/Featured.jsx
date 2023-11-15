// import React from 'react';

import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import featuredImg from "../../../assets/home/featured.jpg";
import "./Featured.css";

const Featured = () => {
    return (
        <div className="featured-item bg-fixed my-20 text-white pt-8">
            <SectionTitle heading={'Featured Item'} subHeading={'check it out'}></SectionTitle>
            <div className="md:flex justify-center items-center py-20 px-36">
                <div>
                    <img src={featuredImg} alt="" />
                </div>
                <div className="md:ml-10 space-y-3">
                    <p>Jan 15 2030</p>
                    <p className="uppercase">Where can I get some?</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam molestiae beatae sapiente magnam alias dolorem ad animi illum, sequi nobis rem eligendi sunt sit officia! Doloremque dolore vel, dolorem, optio, quibusdam in fuga deleniti labore eveniet saepe libero? Pariatur accusantium harum similique nihil ipsam necessitatibus eum illo quaerat quos consequatur!</p>
                    <button className="btn btn-outline border-0 border-b-4 btn-neutral">Order Now</button>
                </div>
            </div>
        </div>
    );
};

export default Featured;