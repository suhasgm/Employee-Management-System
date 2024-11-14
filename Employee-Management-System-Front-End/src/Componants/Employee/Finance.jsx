// src/components/Finance.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate } from 'react-router-dom';

const TOKEN_KEY = 'token'; // Define the token key as a constant

function Finance() {
    const [financeDetails, setFinanceDetails] = useState(null); // Initialize finance details as null
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [error, setError] = useState(null); // State for error handling
    const [email, setEmail] = useState(''); // State to hold user's email

    useEffect(() => {
        const fetchFinanceDetails = async () => {
            try {
                const token = localStorage.getItem(TOKEN_KEY); // Retrieve token from local storage
                const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data.statusCode === 200) {


                    // console.log('API Response:', response.data); // Log the response data

                    // Base64 encode the relevant finance details
                    const encodedFinance = {
                        aadharCard: btoa(response.data.ourEmployee.finance.aadharCard),
                        panCard: btoa(response.data.ourEmployee.finance.panCard),
                        bankDetails: {
                            bankName: btoa(response.data.ourEmployee.finance.bankDetails.bankName),
                            branch: btoa(response.data.ourEmployee.finance.bankDetails.branch),
                            ifscCode: btoa(response.data.ourEmployee.finance.bankDetails.ifsccode),
                        },
                        ctcBreakup: {
                            totalCTC: btoa(response.data.ourEmployee.finance.ctcBreakup.totalCTC),
                        }
                    };

                    setFinanceDetails(encodedFinance); // Set encoded finance details
                    setEmail(response.data.ourEmployee.email); // Set user's email
                } else {
                    Navigate('/error');
                }
            } catch (error) {
                // console.error('Error fetching finance details:', error);
                setError(error.response ? error.response.data.message || 'Failed to fetch finance details' : 'Failed to fetch finance details');
                Navigate('/error');
            } finally {
                setLoading(false); // Set loading to false after request is completed
            }
        };

        fetchFinanceDetails();
    }, []); // Empty dependency array means this effect runs once on mount

    // Function to handle payslip download
    const downloadPayslip = async () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY); // Retrieve token from local storage
            const response = await axios.get(`http://localhost:1010/user/download/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: { email } // Send email as a query parameter
            });

            // Ensure the response contains salary slips in bytes
            if (!response.data || !response.data.salarySlipsbytes) {
                throw new Error('No data returned from the server.');
            }

            const salarySlipsBytes = response.data.salarySlipsbytes;

            // Check if salarySlipsBytes is valid
            if (!salarySlipsBytes || salarySlipsBytes.length === 0) {
                alert('No payslip available for download. Please check your email or contact support.');
                return;
            }

            // Decode Base64 to binary string
            const byteCharacters = atob(salarySlipsBytes); // Decode the Base64 string
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            // Create a blob from the binary data
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'salary_slip.pdf'); // Specify the file name
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object
        } catch (error) {
            console.error('Error downloading payslip:', error);
            alert(`Failed to download payslip. Reason: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    if (loading) {
        return <div className="container text-center">Loading finance details...</div>;
    }

    if (error) {
        return <div className="container text-center text-danger">{error}</div>;
    }

    if (!financeDetails) {
        return <div className="container text-center">No finance details found.</div>;
    }

    return (
        <div className="container vh-100 align-items-center">
            <div className="row p-4">

                <h2 className=' form-control  fw-bold  text-light text-center  p-4' style={{ backgroundColor: '#0dbcdb', fontSize: '20px' }}>Finance Details</h2>

                <form className="form-control  p-4">
                    <div className='row mt-3'>
                        <div className='col-6 mt-3'>
                            <label htmlFor="AadhaarCard" className='form-label'>Aadhaar Card</label>
                            <input type="text" id="AadhaarCard" className='form-control text-secondary ' value={atob(financeDetails.aadharCard) || ''} readOnly />
                        </div>

                        <div className='col-6 mt-3'>
                            <label htmlFor="PanCard" className='form-label'>PAN Card</label>
                            <input type="text" id="PanCard" className='form-control text-secondary ' value={atob(financeDetails.panCard) || ''} readOnly />
                        </div>
                    </div>

                    <h2 className=' form-control mt-5  fw-bold  text-light  p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px' }}>Bank Details</h2>
                    <div className='row mt-4'>

                        <div className='col-6 mt-3'>
                            <label htmlFor="BankName" className='form-label'>Bank Name</label>
                            <input type="text" id="BankName" className='form-control text-secondary ' value={atob(financeDetails.bankDetails.bankName) || ''} readOnly />
                        </div>
                        <div className='col-6 mt-3'>
                            <label htmlFor="Branch" className='form-label'>Branch</label>
                            <input type="text" id="Branch" className='form-control text-secondary ' value={atob(financeDetails.bankDetails.branch) || ''} readOnly />
                        </div>
                    </div>

                    <div className='row mt-4 mb-5'>
                        <div className='col-6 mt-3'>
                            <label htmlFor="IFSC" className='form-label'>IFSC Code</label>
                            <input type="text" id="IFSC" className='form-control text-secondary ' value={atob(financeDetails.bankDetails.ifscCode) || ''} readOnly />
                        </div>

                        <div className='col-6 mt-3'>
                            <label htmlFor="CTC" className='form-label'>CTC Breakup</label>
                            <input type="text" id="CTC" className='form-control text-secondary ' value={atob(financeDetails.ctcBreakup.totalCTC) || ''} readOnly />
                        </div>
                    </div>



                    {/* Project Count and Download Button Column */}
                    <div className="" style={{marginTop:'20px',marginLeft:'25%'}} >
                        <button className="Download-button " type='button' onClick={downloadPayslip} >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="20"
                                viewBox="0 0 640 512"
                            >
                                <path
                                    d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"
                                    fill="white"
                                ></path>
                            </svg>
                            <span>Download Payslip</span>
                        </button>
                        {/* Download Payslip Button */}
                        {/* <button className="btn btn-primary slip mt-4" onClick={downloadPayslip}>Download Payslip</button> */}
                    </div>


                    {/* 

                    <div className='row mt-5'>
                        <div className='col-6'>
                            <button type='button' className='btn btn-secondary' onClick={downloadPayslip}>Download Payslip</button>
                        </div>
                    </div> */}
                </form>
            </div>
        </div>
    );
}

export default Finance;
