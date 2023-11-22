import PropTypes from 'prop-types';

import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading){
        // console.log("Loading...");
        return <span className="loading loading-spinner loading-lg"></span>
    }

    if(user){
        return children;    
    }

    // const anotherExample = <Navigate to="/login" state={{from: location}} replace></Navigate>;
    return <Navigate to="/login" state={{from:location}} replace></Navigate>
    
};

PrivateRoute.propTypes = {
    children: PropTypes.node
};

export default PrivateRoute;