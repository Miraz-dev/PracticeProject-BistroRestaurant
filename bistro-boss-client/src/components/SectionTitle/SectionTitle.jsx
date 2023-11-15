// import React from 'react';
import PropTypes from 'prop-types';

const SectionTitle = ({heading, subHeading}) => {
    return (
        <div className='text-center mx-auto md:w-4/12 my-8'>
            <p className='text-yellow-500 mb-2'>---{subHeading}---</p>
            <h3 className='text-4xl uppercase border-y-4 py-4'>{heading}</h3>
        </div>
    );
};

SectionTitle.propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.string
};

export default SectionTitle;