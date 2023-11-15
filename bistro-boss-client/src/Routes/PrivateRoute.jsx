import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const location = useLocation();

    if(loading){
        return <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
    }

    if(user?.email){
        return children;    
    }

    // const anotherExample = <Navigate to="/login" state={{from: location}} replace></Navigate>;
    return <Navigate to="/login" state={{from:location}} replace></Navigate>
    
};

PrivateRoute.propTypes = {
    children: PropTypes.node
};

export default PrivateRoute;