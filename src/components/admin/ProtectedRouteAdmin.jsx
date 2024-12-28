import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";
import { setIstoken } from "../../slices/profileSlice";

// Utility function to get a cookie by name

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const ProtectedRouteAdmin = ({ allowedRoles = ["Admin"] }) => {
  const dispatch = useDispatch();
  const { user , istoken } = useSelector((state) => state.profile);
  const { token: localToken } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.profileData);

  useEffect(() => {
    const token = getCookie("token") || localToken;

    console.log("token:", getCookie("token"));

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        const tokenValid = currentTime < decodedToken.exp;
        dispatch(setIstoken(tokenValid));
      } catch (error) {
        console.error("Error decoding token:", error);
        dispatch(setIstoken(false));
      }
    } else {
      dispatch(setIstoken(false));
    }
  }, [dispatch]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.accountType)) {
    return <Navigate to="/" />;
  }


  if (!istoken) {
    return <Navigate to="/login" />;
  }

  if (!profile.firstname || !profile.lastname) {
    return <Navigate to="/profileupdate" />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;



// import React from 'react'
// import { useSelector ,useDispatch} from 'react-redux'
// import {  useState,useEffect } from 'react';
// import jwtDecode from 'jwt-decode';
// import {setIstoken} from "../../slices/profileSlice"
// import { Navigate ,Outlet} from 'react-router-dom'

// const ProtectedRouteAdmin = () => {

//   const dispatch = useDispatch()
//   const {user,istoken} = useSelector((state)=>state.profile)
//   const {profile} = useSelector((state)=>state.profileData)

//     useEffect(() =>{
//       if (user && user.token) {
//         const decodedToken = jwtDecode(user.token);
//         // console.log("decoded token",decodedToken)
//         const currentTime = Date.now() / 1000;
//         // console.log("current time",currentTime)
//         // console.log(currentTime < decodedToken.exp)
//         dispatch(setIstoken(currentTime < decodedToken.exp));
//         // console.log(istoken)
//       } else {
//         dispatch(setIstoken(false));
//       }
//     },[user])

//     if (!user) {
//       return <Navigate to="/login" />;
//     }

//     if (user.accountType !== "Admin") {
//         return <Navigate to="/" />;
//       }

//   if (!istoken) {
//     return <Navigate to="/login" />;
//   }

// if (!profile.firstname || !profile.lastname ) {
//   return <Navigate to="/profileupdate" />;
// }

//   return <Outlet />;
// };

// export default ProtectedRouteAdmin;
