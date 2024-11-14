// src/components/Projects.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


const TOKEN_KEY = 'token';

function Projects() {
    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data.statusCode === 200) {

                    setEmployee(response.data.ourEmployee);
                }
                else {
                    navigate('/error');
                }
            } catch (error) {
                // console.error('Error fetching employee details:', error);
                setError(error.response ? error.response.data.message || 'Failed to fetch employee details' : 'Failed to fetch employee details');
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    if (loading) {
        return (
            <div className="container text-center">
                <div className="spinner-border" role="status"></div>
                Loading employee details...
            </div>
        );
    }

    if (error) {
        return <div className="container text-center text-danger">{error}</div>;
    }

    if (!employee || !employee.projectDetailsList) {
        return <div className="container text-center">No employee data found.</div>;
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className='row mt-3 col-lg-12 p-4'>
                <h2 className=' form-control   fw-bold  text-light  p-4' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px' }}>Project Details</h2>
                <form className=' p-4 pt-4 form-control mt-3'>

                    {employee.projectDetailsList.length > 0 ? (
                        <table className="table  table-striped table-bordered table-hover" style={{ boxShadow: '1px 0px 20px rgba(0,0,0,0.1)' }}>
                            <thead style={{ textAlign: 'center' }}>
                                <tr>
                                    <th scope="col" style={{ color: 'red' }}>S.No</th>
                                    <th scope="col" style={{ color: 'red' }}>Project Code</th>
                                    <th scope="col" style={{ color: 'red' }}>Project Name</th>
                                    <th scope="col" style={{ color: 'red' }}>Start Date</th>
                                    <th scope="col" style={{ color: 'red' }}>End Date</th>
                                    <th scope="col" style={{ color: 'red' }}>Reporting Manager Code</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employee.projectDetailsList.map((project, index) => (
                                    <tr key={index} style={{ textAlign: 'center' }}>
                                        <td>{index + 1}</td>
                                        <td>{project.projectCode}</td>
                                        <td>{project.projectName}</td>
                                        <td>{project.startDate}</td>
                                        <td>{project.endDate}</td>
                                        <td>{project.reportingManagerEmployeeCode}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className=' text-center mt-3  p-5' style={{ fontSize: '20px', color:'red' }}>No project details available.</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Projects;
