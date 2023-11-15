// import React from 'react';

import { Helmet } from "react-helmet-async";
import Cover from "../../Shared/Cover/Cover";
import menuBg from "../../../assets/menu/banner3.jpg";
import dessertBg from "../../../assets/menu/dessert-bg.jpeg";
import pizzaBg from "../../../assets/menu/pizza-bg.jpg";
import saladBg from "../../../assets/menu/salad-bg.jpg";
import soupBg from "../../../assets/menu/soup-bg.jpg";
import useMenu from "../../../hooks/useMenu";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import MenuCategory from "../MenuCategory/MenuCategory";
// import PopularMenu from "../../Home/PopularMenu/PopularMenu";

const Menu = () => {
    const [menu] = useMenu();
    const dessert = menu.filter(item => item.category === "dessert");
    const soup = menu.filter(item => item.category === "soup");
    const salad = menu.filter(item => item.category === "salad");
    const pizza = menu.filter(item => item.category === "pizza");
    const offered = menu.filter(item => item.category === "offered");
    return (
        <div>
            <Helmet>
                <title>Bistro | Menu</title>
            </Helmet>
            <Cover img={menuBg} title={'Our menu'}></Cover>

            {/* Offered */}
            <SectionTitle subHeading={'Do not miss'} heading={'Todays offer'}></SectionTitle>
            <MenuCategory items={offered}></MenuCategory>

            {/* Dessert */}
            <MenuCategory items={dessert} title={'dessert'} img={dessertBg}></MenuCategory>

            {/* pizza */}
            <MenuCategory items={pizza} title={'pizza'} img={pizzaBg}></MenuCategory>


            <MenuCategory items={salad} title={'salad'} img={saladBg}></MenuCategory>


            <MenuCategory items={soup} title={'soup'} img={soupBg}></MenuCategory>
        </div>
    );
};

export default Menu;