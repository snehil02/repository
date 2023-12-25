import React, { Component } from 'react';
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthApi from './Auth';
import Cookies from "js-cookie";

const ProtectedRoute = ({component:Component, ...rest}) => {
    const Auth = Cookies.get("session");
    // console.log(Auth);
    return (
        <Route
            {...rest}
            render = {(props) => (
                Auth === undefined ?
               ( <Redirect to="/login" />
            ) : ( 
                <Component {...props}/>
                )
            )}
        />
    )
};
export const ProtectedRouteAdmin = ({component:Component, ...rest}) => {
    const Auth = Cookies.get("username");
    // console.log(Auth);
    return (
        <Route
            {...rest}
            render = {(props) => (
                Auth == 'admin' ?
               ( <Component {...props}/>
            ) : ( 
                <Redirect to="/adminlogin" />
                )
            )}
        />
    )
};
export default ProtectedRoute;