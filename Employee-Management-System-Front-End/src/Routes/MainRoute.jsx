import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import EmployeeRoute from './EmployeeRoute';
import Login from '../Login';
import AdminRoute from './AdminRoute';
import ErrorPage404 from '../Componants/ErrorPage/ErrorPage404';




const MainiRoute = () => {
  return (

    <Routes>
      <Route index element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoute />} />
      <Route path="/user/*" element={<EmployeeRoute />} />
      <Route path="/error" element={<ErrorPage404 />} />
      <Route path="*" element={<Navigate to="/error" />} />
  
  

    </Routes>

  );
};

export default MainiRoute;
