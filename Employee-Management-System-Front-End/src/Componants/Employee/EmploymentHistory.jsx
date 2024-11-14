// src/components/EmploymentHistory.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';


const TOKEN_KEY = 'token';

function EmploymentHistory() {
    const [employmentHistoryList, setEmploymentHistoryList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmploymentHistory = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY);
                console.log('Fetching employment history...');
                const response = await axios.get(`http://localhost:1010/adminuser/get-profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // console.log('Response:', response.data); // Log the response

                // Access the employment history from the professional details

                if (response.data.statusCode === 200) {

                    const employmentHistoryList = response.data.ourEmployee.professionalDetails?.employmentHistoryList || [];
                    setEmploymentHistoryList(employmentHistoryList);
                }
                else {
                    navigate('/error');
                }
            } catch (error) {
                console.error('Error fetching employment history:', error);
                setError(error.response ? error.response.data.message || 'Failed to fetch employment history' : 'Failed to fetch employment history');
                navigate('/error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmploymentHistory();
    }, []);

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border" role="status"></div>
                <p>Loading employment history...</p>
            </div>
        );
    }

    if (error) {
        return <div className="container text-center text-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
           
            <h2 className=' form-control   fw-bold  text-light  p-4' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px' }}>Employment History</h2>
              
            {employmentHistoryList && employmentHistoryList.length > 0 ? (
                <div className="table-responsive form-control">
                    <table className="table   table-striped table-bordered table-hover" style={{ boxShadow: '1px 0px 20px rgba(0,0,0,0.1)' }}>
                        <thead className="table-light  text-center  ">
                            <tr >
                                <th style={{ color: 'red' }} scope="col">S.No</th>
                                <th style={{ color: 'red' }} scope="col">Company Name</th>
                                <th style={{ color: 'red' }} scope="col">Job Title</th>
                                <th style={{ color: 'red' }} scope="col">Joining Date</th>
                                <th style={{ color: 'red' }} scope="col">End Date</th>
                                <th style={{ color: 'red' }} scope="col">Job Description</th>
                            </tr>
                        </thead>
                        <tbody className='text-center  ' >
                            {employmentHistoryList.map((employment, index) => (
                                <tr key={employment.employmentHistoryId}  style={{ textAlign: 'center' }}>
                                    <td>{index + 1}</td> {/* Serial Number */}
                                    <td>{employment.companyName}</td>
                                    <td>{employment.jobTitle}</td>
                                    <td>{employment.joiningDate}</td>
                                    <td>{employment.endingDate}</td>
                                    <td>{employment.jobDescription}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center  p-5 mt-3"  style={{ fontSize: '20px', color:'red' }}>No employment history available.</p>
            )}
        </div>
    );
}

export default EmploymentHistory;
