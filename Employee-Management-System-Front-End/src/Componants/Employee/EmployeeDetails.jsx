// src/components/EmployeeDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


const TOKEN_KEY = 'token'; // Define the token key as a constant

function EmployeeDetails() {
    const [employee, setEmployee] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY); // Retrieve token from local storage
                console.log('Token:', employee);
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
                // Provide detailed error feedback
                
                setError(error.response ? error.response.data.message || 'Failed to fetch employee details' : 'Failed to fetch employee details');
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    if (loading) {
        return <div className="container text-center">Loading employee details...</div>;
    }

    if (error) {
        return <div className="container text-center text-danger">{error}</div>;
    }

    if (!employee) {
        return <div className="container text-center">No employee data found.</div>;
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className='row col-lg-11 p-4'>

                <form className='form-control p-5 mb-5'>
                    <h2 className=' form-control  fw-bold  text-light text-center  p-4' style={{ backgroundColor: '#0dbcdb', fontSize: '20px' }}>Profile</h2>

                    <div className='row col-lg-12 mb-lg-0 mb-sm-3 mt-3'>
                        <div className='col-lg-4 mb-lg-0 mb-sm-3 p-lg-4'>
                            <label htmlFor="Fullname" className='form-label'>Employee Name</label>
                            <input type="text" id="Fullname" className='form-control text-secondary' value={employee.fullName || ''} readOnly />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="DateOfBirth" className='form-label'>Date of Birth</label>
                            <input type="date" id="DateOfBirth" className='form-control text-secondary' value={employee.dateOfBirth || ''} readOnly />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="Age" className='form-label'>Age</label>
                            <input type="text" id="Age" className='form-control text-secondary' value={employee.age || ''} readOnly />
                        </div>
                    </div>



                    <div className='row col-lg-12'>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="Gender" className='form-label'>Gender</label>
                            <input type="text" id="Gender" className='form-control text-secondary' value={employee.gender || ''} readOnly />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="Mobile" className='form-label'>Mobile Number</label>
                            <input type="text" id="Mobile" className='form-control text-secondary' value={employee.mobileNumber || ''} readOnly />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="PersonalEmail" className='form-label'>Personal Email</label>
                            <input type="email" id="PersonalEmail" className='form-control text-secondary' value={employee.email || ''} readOnly />
                        </div>
                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-lg-6 p-lg-4'>
                            <label htmlFor="EmergencyContactName" className='form-label'>Emergency Contact Name</label>
                            <input type="text" id="EmergencyContactName" className='form-control text-secondary' value={employee.emergencyContactName || ''} readOnly />
                        </div>
                        <div className='col-lg-6 p-lg-4'>
                            <label htmlFor="EmergencyContactNumber" className='form-label'>Emergency Contact Number</label>
                            <input type="text" id="EmergencyContactNumber" className='form-control text-secondary' value={employee.emergencyContactNumber || ''} readOnly />
                        </div>
                    </div>

                    <h2 className=' form-control mt-3  fw-bold  text-light  p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px' }}>Address Details</h2>


                    <div className='row col-lg-12'>

                        <h2 className='   fw-bold  text-secondary p-3' style={{ fontSize: '20px' }}>Current Address Details</h2>

                        <div className='col-lg-4 pt-4 ps-5'>
                            <label htmlFor="CurrentAddressLine1" className='form-label'> Address Line 1</label>
                            <input type="text" id="CurrentAddressLine1" className='form-control text-secondary' value={employee.currentAddress?.addressLineI || ''} readOnly />
                        </div>
                        <div className='col-lg-4 pt-4  ps-5'>
                            <label htmlFor="CurrentAddressLine1" className='form-label'>Address Line 2</label>
                            <input type="text" id="CurrentAddressLine1" className='form-control text-secondary' value={employee.currentAddress?.addressLineII || ''} readOnly />
                        </div>
                        <div className='col-lg-4 pt-4 ps-5'>
                            <label htmlFor="CurrentAddressLine1" className='form-label'>Address Line 1</label>
                            <input type="text" id="CurrentAddressLine1" className='form-control text-secondary' value={employee.currentAddress?.city || ''} readOnly />
                        </div>
                        <div className='col-lg-4 pt-4 ps-5'>
                            <label htmlFor="CurrentAddressLine1" className='form-label'>PIN Code</label>
                            <input type="text" id="CurrentAddressLine1" className='form-control text-secondary' value={employee.currentAddress?.pinCode || ''} readOnly />
                        </div>

                    </div>


                    <div className='row col-lg-12 mb-5 mt-4'>
                        <h2 className='   fw-bold  text-secondary p-3' style={{ fontSize: '20px' }}>Permanent Address Details</h2>

                        <div className='col-lg-4  pt-4  ps-5 '>
                            <label htmlFor="PermanentAddressLine1" className='form-label'>Address Line 1</label>
                            <input type="text" id="PermanentAddressLine1" className='form-control text-secondary' value={employee.permanentAddress?.addressLineI || ''} readOnly />
                        </div>
                        <div className='col-lg-4  pt-4  ps-5'>
                            <label htmlFor="PermanentAddressLine1" className='form-label'>Address Line 2</label>
                            <input type="text" id="PermanentAddressLine1" className='form-control text-secondary' value={employee.permanentAddress?.addressLineII || ''} readOnly />
                        </div>
                        <div className='col-lg-4  pt-4  ps-5'>
                            <label htmlFor="PermanentAddressLine1" className='form-label'>Address  City</label>
                            <input type="text" id="PermanentAddressLine1" className='form-control text-secondary' value={employee.permanentAddress?.city || ''} readOnly />
                        </div>
                        <div className='col-lg-4  pt-4  ps-5 '>
                            <label htmlFor="PermanentAddressLine1" className='form-label'>Address PIN Code</label>
                            <input type="text" id="PermanentAddressLine1" className='form-control text-secondary' value={employee.permanentAddress?.pinCode || ''} readOnly />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeDetails;
