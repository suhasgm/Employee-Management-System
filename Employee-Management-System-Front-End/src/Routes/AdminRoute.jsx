import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PutRequestMain from '../Componants/Admin/PutRequest/PutRequestMain';
import AdminNavBar from '../Componants/Admin/AdminNavBar';
import AdminDashboard from '../Componants/Admin/AdminDashboard';
import NewEmployee from '../Componants/Admin/NewEmployee';
import ErrorPage404 from '../Componants/ErrorPage/ErrorPage404';



const AdminRoute = () => {
    return (

        <div className="d-flex ">
            <AdminNavBar />
            <div className="flex-grow-1 p-3" >
                <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/new-employee" element={<NewEmployee />} />

                    <Route path="/dashboard" element={<AdminDashboard />} />
                    {/* <Route path="/professional" element={<AddProfessionalDetails />} /> */}
                    <Route path='/all-employees' element={<PutRequestMain />} />
                    {/* <Route path="/projects" element={<Projects />} /> */}
                    {/* <Route path="/finance" element={<DemoAddEmployee />} /> */}
                    {/* <Route path="/logout" element={<Login />} /> */}
                    <Route path="/*" element={<ErrorPage404 />} />  
                </Routes>
            </div>
        </div>

    );
};

export default AdminRoute;
