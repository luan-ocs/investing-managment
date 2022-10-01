import React, { useContext } from 'react';
import { Outlet, Route, Navigate } from 'react-router-dom';
import { userContext } from './userProvider';

export const ProtectedRoutes = () => {
  const { user } = useContext(userContext);

  console.log(user);

  return user?.name ? <Outlet /> : <Navigate to={'/login'} />;
};

export default ProtectedRoutes;
