// import React from 'react';
import PropTypes from 'prop-types';
import FoodCard from '../../../components/FoodCard/FoodCard';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
// https://codesandbox.io/p/sandbox/m54gfx?file=%2Fsrc%2FApp.jsx%3A9%2C23

const OrderTab = ({ items }) => {

    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };


    return (
        <div>
            {/* {
                items.map(item => <FoodCard key={item._id} item={item}></FoodCard>)
            } */}
            <Swiper
                pagination={pagination}
                modules={[Pagination]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center">

                    {
                        items.map(item => <FoodCard key={item._id} item={item}></FoodCard>)
                    }
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

OrderTab.propTypes = {
    items: PropTypes.array
};

export default OrderTab;