// PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate  } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
   // const { isAuthenticated } = useContext(AuthContext);
   //const { isAuthenticated } = useContext(AuthContext);
   const  isAuthenticated = true;

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Navigate  to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
