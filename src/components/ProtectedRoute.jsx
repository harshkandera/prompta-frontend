import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setIstoken } from "../slices/profileSlice";
import { Navigate, Outlet } from 'react-router-dom';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const ProtectedRouteAdmin = ({ allowedRoles = ['Student'] }) => {
  const dispatch = useDispatch();
  const { user, istoken } = useSelector((state) => state.profile);
  const { profile } = useSelector((state) => state.profileData);
  const { token: localToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = getCookie('token') || localToken;

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        const tokenValid = currentTime < decodedToken.exp;
        dispatch(setIstoken(tokenValid));
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch(setIstoken(false));
      }
    } else {
      dispatch(setIstoken(false));
    }
  }, [dispatch, localToken]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.accountType)) {
    return <Navigate to="/" />;
  }

  if (!istoken) {
    return <Navigate to="/login" />;
  }

  if (!profile?.firstname || !profile?.lastname) {
    return <Navigate to="/profileupdate" />;
  }

  return <Outlet />;
};

export default ProtectedRouteAdmin;
