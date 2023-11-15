// import React from 'react';
import PropTypes from 'prop-types';

const MenuItem = ({item}) => {
    const {name, image, price, recipe} = item;

    return (
        <div className='flex space-x-4'>
            <div>
            <img style={{borderRadius: '0 200px 200px 200px'}} className='w-[118px] h-[104px]' src={image} alt="" />
            </div>
            <div>
                <h3>{name} ---------</h3>
                <p>{recipe}</p>
            </div>
            <p className='text-yellow-400'>${price}</p>
        </div>
    );
};

MenuItem.propTypes = {
    item: PropTypes.object
};

export default MenuItem;