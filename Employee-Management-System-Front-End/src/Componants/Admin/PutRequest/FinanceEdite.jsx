import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const FinanceEdit = ({ employee, onClose }) => {
    const [finance, setFinance] = useState({
        finance: {
            panCard: '',
            aadharCard: '',
            bankDetails: {
                bankName: '',
                branch: '',
                ifsccode: '',
            },
            ctcBreakup: {
                basicSalary: 0,
                hra: 0,
                providentFund: 0,
                specialAllowance: 0,
                bonus: 0,
                otherBenefits: 0,
                totalCTC: 0,
            },
        },
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (employee) {
            setFinance({
                finance: {
                    panCard: employee.finance?.panCard || '',
                    aadharCard: employee.finance?.aadharCard || '',
                    bankDetails: {
                        bankName: employee.finance?.bankDetails?.bankName || '',
                        branch: employee.finance?.bankDetails?.branch || '',
                        ifsccode: employee.finance?.bankDetails?.ifsccode || '',
                    },
                    ctcBreakup: {
                        basicSalary: employee.finance?.ctcBreakup?.basicSalary || 0,
                        hra: employee.finance?.ctcBreakup?.hra || 0,
                        providentFund: employee.finance?.ctcBreakup?.providentFund || 0,
                        specialAllowance: employee.finance?.ctcBreakup?.specialAllowance || 0,
                        bonus: employee.finance?.ctcBreakup?.bonus || 0,
                        otherBenefits: employee.finance?.ctcBreakup?.otherBenefits || 0,
                        totalCTC: employee.finance?.ctcBreakup?.totalCTC || 0,
                    },
                },
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length === 3) { // e.g., bankDetails.branch
            setFinance((prev) => ({
                ...prev,
                finance: {
                    ...prev.finance,
                    bankDetails: {
                        ...prev.finance.bankDetails,
                        [keys[2]]: value,
                    },
                },
            }));
        } else if (keys.length === 2) { // e.g., ctcBreakup.basicSalary
            setFinance((prev) => ({
                ...prev,
                finance: {
                    ...prev.finance,
                    ctcBreakup: {
                        ...prev.finance.ctcBreakup,
                        [keys[1]]: parseFloat(value) || 0, // Convert to number
                    },
                },
            }));
        } else {
            setFinance((prev) => ({
                ...prev,
                finance: {
                    ...prev.finance,
                    [name]: value,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setIsLoading(true);

        try {
            const response = await axios.put(`http://localhost:1010/admin/update/${employee.employeeId}`, finance, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.data.statusCode === 200) {
                setSuccess('Employee Details Updated Successfully!');
                setTimeout(() => setSuccess(''), 10000);
                // setTimeout(() => {
                //     window.location.reload(); // Reload the page
                // }, 4000);
            } else {
                throw new Error('Unexpected Response Status');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            // console.error('Error updating employee:', error);
            if (error.response) {
                setError(error.response.data.message || 'Error Updating Employee.');
                setTimeout(() => setError(''), 5000);
            } else {
                // setError('Error in Setting up Request: ' + error.message);
                setError('Duplicate Entry Detected.! Email or Aadhaar Number Exists.');
                setTimeout(() => setError(''), 5000);
            }
            setSuccess('');
        } finally {
            setIsLoading(false);
        }
    };

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="row col-lg-9 p-4">

                {isLoading && <p>Loading...</p>}
                <form className="form-control" onSubmit={handleSubmit}>
                    <h2 className=' form-control  fw-bold mt-2 text-light text-center bg-info p-4' style={{ fontSize: '20px' }}>Financial Details</h2>
                    <div className="row col-lg-12 mb-lg-0 mb-sm-3 ">
                        <div className="col-lg-6 p-lg-4">
                            <label htmlFor="panCard" className="form-label">
                                PAN Card <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                placeholder="Enter PAN Card"
                                name="panCard"
                                value={finance.finance.panCard}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-lg-6 p-lg-4">
                            <label htmlFor="aadharCard" className="form-label">
                                Aadhar Card <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="number"
                                className="form-control text-secondary"
                                placeholder="Enter Aadhar Card"
                                name="aadharCard"
                                value={finance.finance.aadharCard}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row col-lg-12 mb-lg-0 mb-sm-3 ">
                        <div className="col-lg-6 p-lg-4">
                            <label htmlFor="bankDetails.bankName" className="form-label">
                                Bank Name <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                placeholder="Enter Bank Name"
                                name="finance.bankDetails.bankName"
                                value={finance.finance.bankDetails?.bankName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-lg-6 p-lg-4">
                            <label htmlFor="bankDetails.branch" className="form-label">
                                Branch <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                placeholder="Enter Branch"
                                name="finance.bankDetails.branch"
                                value={finance.finance.bankDetails?.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row col-lg-12 mb-lg-0 mb-sm-3 ">
                        <div className="col-lg-6 p-lg-4">
                            <label htmlFor="bankDetails.ifsccode" className="form-label">
                                IFSC Code <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                placeholder="Enter IFSC Code"
                                name="finance.bankDetails.ifsccode"
                                value={finance.finance.bankDetails?.ifsccode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <h2 className='  mt-4  form-control fw-bold text-center  text-light p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px',marginLeft:'10px' }}>CTC Brackup</h2>

                    <div className="row col-lg-12 mb-lg-0 mb-sm-3">
                        {Object.keys(finance.finance?.ctcBreakup).map((key, index) => (
                            <div className="col-lg-4 p-lg-4" key={index}>
                                <label htmlFor={`ctcBreakup.${key}`} className="form-label">
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()} <span className="text-danger fw-bold">*</span>
                                </label>
                                <input
                                    type="number"
                                    className="form-control text-secondary"
                                    placeholder={`Enter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                                    name={`ctcBreakup.${key}`}
                                    value={finance.finance.ctcBreakup[key]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div  className=" p-lg-4 row col-lg-12 " style={{alignItems : 'center', display :'flex', justifyContent:'center'}}>

                        <div className="col-lg-6 text-end">
                            <Button type="submit" className="btn btn-warning fw-bold text-light me-2" disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update'}
                            </Button>
                           </div>
                    </div>

                {error && <Alert variant="danger text-center" style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{error}</Alert>}
                {success && <Alert variant="success text-center" style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{success}</Alert>}
                
                </form>
            </div>
        </div>
    );
};

export default FinanceEdit;
