import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


const TOKEN_KEY = 'token'; // Define the token key as a constant

function ProfessionalDetails() {

    const [professionalDetails, setProfessionalDetails] = useState({});
    const [loading, setLoading] = useState({});
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY); // Retrieve token from local storage
                console.log('Token:', professionalDetails);
                const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.statusCode === 200) {

                    setProfessionalDetails(response.data.ourEmployee.professionalDetails);
                }
                else {
                    navigate('/error');
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
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

    if (!professionalDetails) {
        return <div className="container text-center">No employee data found.</div>;
    }

    return (

        <div className="container-fluid  d-flex justify-content-center   " >
            <div className="row ">

                <form className='form-control p-5 mt-3 mb-5 ' style={{ width: '1000px' }}>
                    <h2 className=' form-control  fw-bold  text-light text-center bg-info p-4' style={{ fontSize: '20px' }}>Professional Details</h2>

                    <div className="row mt-5">
                        <div className="col-lg-4 mt-2">
                            <label htmlFor="EmployeeCode" className="form-label">Employee Code</label>
                            <input type="text" className="form-control text-secondary " value={professionalDetails.employeeId || ''} readOnly />

                        </div>

                        <div className='col-lg-4 mt-2'>
                            <label htmlFor="Company Mail" className='form-label'>Company Mail</label>
                            <input type="email" className='form-control text-secondary ' value={professionalDetails.companyMail || ''} readOnly />

                        </div>


                        <div className='col-lg-4 mt-2'>
                            <label htmlFor="Company Mail" className='form-label'>Office Phone</label>
                            <input type="email" className='form-control text-secondary ' value={professionalDetails.officePhone || ''} readOnly />

                        </div>
                    </div>

                    <div className='row mt-4'>

                        <div className='col-6 mt-2'>
                            <label htmlFor="ManagerCode" className='form-label'>Manager Employee Code</label>
                            <input type="text" className='form-control text-secondary ' value={professionalDetails.reportingManagerEmployeeCode || ''} readOnly />

                        </div>
                        <div className='col-6 mt-2'>
                            <label htmlFor="HR_Name" className='form-label'>HR Name</label>
                            <input type="text" className='form-control text-secondary ' value={professionalDetails.hrName || ''} readOnly />

                        </div>

                    </div>



                    <div className='row mt-4'>
                        <div className='col-6 mt-2'>
                            <label htmlFor="DateOfJoin" className='form-label'>Date Of Joining</label>
                            <input type="date" className='form-control text-secondary ' value={professionalDetails.dateOfJoining || ''} readOnly />

                        </div>


                    </div>

                    <h2 className=' mt-5  form-control fw-bold  text-light p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px' }}>Office Address</h2>


                    <div className='row mt-4'>
                        <div className='col-4 mt-2'>
                            <label htmlFor="Address1" className='form-label'>Address 1</label>
                            <input type="text" className='form-control text-secondary ' value={professionalDetails.officeAddress?.addressLineI || ''} readOnly />

                        </div>

                        <div className='col-4 mt-2'>
                            <label htmlFor="Address2" className='form-label'>Address 2</label>
                            <input type="text" className='form-control text-secondary ' value={professionalDetails.officeAddress?.addressLineII || ''} readOnly />

                        </div>
                        <div className='col-4 mt-2'>
                            <label htmlFor="PinCode " className='form-label'> Pin Code </label>
                            <input type="number" className='form-control text-secondary' value={professionalDetails.officeAddress?.pinCode || ''} readOnly />

                        </div>

                    </div>

                </form>

            </div>


        </div>

    );

}

export default ProfessionalDetails;