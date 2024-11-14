// App.js
import React from 'react';
import { Route, Routes, Outlet } from 'react-router-dom';
import EmployeeDetails from '../Componants/Employee/EmployeeDetails';
import ProfessionalDetails from '../Componants/Employee/ProfessionalDetails';
import Projects from '../Componants/Employee/Projects';
import Finance from '../Componants/Employee/Finance';
import EmploymentHistory from '../Componants/Employee/EmploymentHistory';
import EmployeeNavBar from '../Componants/Employee/EmployeeNavBar';
import Dashboard from '../Componants/Employee/Dashboard';
import PasswordReset from '../Componants/Employee/PasswordReset';
import ErrorPage404 from '../Componants/ErrorPage/ErrorPage404.jsx';
const EmployeeRoute = () => {
  return (
    
      <div className="d-flex">
        <EmployeeNavBar />
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route index element={<Dashboard />} />
            <Route path="/profile" element={<EmployeeDetails />} />
            <Route path="/professional" element={<ProfessionalDetails />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/history" element={<EmploymentHistory />} />
            <Route path='/password-reset'element={<PasswordReset/>}/>
            {/* <Route path="/logout" element={<Login />} /> */}
            <Route path="/*" element={<ErrorPage404 />} /> {/* 404 Route */}
    
          </Routes>
          <Outlet />
          
        </div>
      </div>
    
  );
};

export default EmployeeRoute;
