import React, { useState, useEffect } from 'react';
import { Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const PersonalEdit = ({ employee, onClose }) => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // New state for success message
    const [isLoading, setIsLoading] = useState(false); // New state for loading
    const [isSameAddress, setIsSameAddress] = useState(false); // State for checkbox

    useEffect(() => {
        if (employee) {
            setFormData(employee);
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested fields for addresses
        if (name.includes('currentAddress') || name.includes('permanentAddress')) {
            const [addressType, field] = name.split('.');
            setFormData(prevData => ({
                ...prevData,
                [addressType]: {
                    ...prevData[addressType],
                    [field]: value
                }
            }));
        } else {
            setFormData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsSameAddress(checked);

        if (checked) {
            // If checked, set both current and permanent address to be the same
            setFormData(prevData => ({
                ...prevData,
                currentAddress: {
                    ...prevData.currentAddress // Keep current address as it is
                },
                permanentAddress: {
                    ...prevData.currentAddress // Copy current address to permanent address
                }
            }));
        } else {
            // If unchecked, clear permanent address fields (you can also choose to keep them unchanged)
            setFormData(prevData => ({
                ...prevData,
                permanentAddress: {
                    addressLineI: '',
                    addressLineII: '',
                    city: '',
                    pinCode: ''
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setIsLoading(true); // Set loading to true

        try {
            const response = await axios.put(`http://localhost:1010/admin/update/${formData.employeeId}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.statusCode === 200) {
                setSuccess('Employee Details Updated Successfully!'); // Set success message
                setError(''); // Clear error message
                // // Close modal after a short delay
                // setTimeout(onClose, 2000); // Adjust delay as needed
                setTimeout(() => setSuccess(''), 3000);
                setTimeout(() => {
                    window.location.reload(); // Reload the page
                }, 4000);
            } else {
                setError('Duplicate Entry Detected.! Email Already Exists.');
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            setError('Error updating employee. Please try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <div className="container d-flex justify-content-center">
            <div className='row col-lg-9 p-4'>



                <form className='form-control' onSubmit={handleSubmit}>
                    <h2 className='form-control  fw-bold mt-2 text-light text-center bg-info p-4' style={{ fontSize: '20px' }}>Personal Details</h2>

                    <div className='row col-lg-12 mb-lg-0 mb-sm-3 mt-3'>
                        <div className='col-lg-4 mb-lg-0 mb-sm-3 p-lg-4'>
                            <label htmlFor="fullName" className='form-label'>Employee Name <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                placeholder='Enter Your Full Name'
                                name="fullName"
                                value={formData.fullName || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="role" className='form-label'>ADMIN / USER <span className='text-danger fw-bold'>*</span></label>
                            <select
                                name="role"
                                className='form-control text-secondary'
                                value={formData.role || ''}
                                onChange={handleChange}
                                required
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-lg-6 p-lg-4 mb-sm-3'>
                            <label htmlFor="mobileNumber" className='form-label'>Mobile Number <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="number"
                                className='form-control text-secondary'
                                name="mobileNumber"
                                value={formData.mobileNumber || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-lg-6 p-lg-4 mb-sm-3'>
                            <label htmlFor="email" className='form-label'>Personal Mail <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="email"
                                className='form-control text-secondary'
                                placeholder='Enter Your Mail'
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-md-6 p-lg-4 mb-sm-3'>
                            <label htmlFor="emergencyContactName" className='form-label'>Emergency Contact Name <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="emergencyContactName"
                                value={formData.emergencyContactName || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-md-6 p-lg-4'>
                            <label htmlFor="emergencyContactNumber" className='form-label'>Emergency Contact Number <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="number"
                                className='form-control text-secondary'
                                name="emergencyContactNumber"
                                value={formData.emergencyContactNumber || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <h2 className='  mt-4  form-control fw-bold text-center  text-light p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px', marginLeft: '10px' }}>Address Details</h2>

                    <div className='row col-lg-12'>
                        <h2 className='   fw-bold ms-2 text-secondary p-3' style={{ fontSize: '20px' }}>Current Address Details</h2>

                        <div className='col-lg-4 p-lg-4 mb-sm-3'>
                            <label htmlFor="currentAddress.addressLineI" className='form-label'> Address Line 1 <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="currentAddress.addressLineI"
                                value={formData.currentAddress?.addressLineI || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="currentAddress.addressLineII" className='form-label'> Address Line 2</label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="currentAddress.addressLineII"
                                value={formData.currentAddress?.addressLineII || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="currentAddress.city" className='form-label'> City <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="currentAddress.city"
                                value={formData.currentAddress?.city || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-md-6 p-lg-4 mb-sm-3'>
                            <label htmlFor="currentAddress.pinCode" className='form-label'>PIN Code <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="currentAddress.pinCode"
                                value={formData.currentAddress?.pinCode || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className='row col-lg-12'>
                        <h2 className='   fw-bold ms-2 text-secondary p-3' style={{ fontSize: '20px' }}>Permanent Address Details</h2>

                        <div className='col-lg-4 p-lg-4 mb-sm-3'>
                            <label htmlFor="permanentAddress.addressLineI" className='form-label'>Address Line 1 <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="permanentAddress.addressLineI"
                                value={formData.permanentAddress?.addressLineI || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="permanentAddress.addressLineII" className='form-label'>Address Line 2</label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="permanentAddress.addressLineII"
                                value={formData.permanentAddress?.addressLineII || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='col-lg-4 p-lg-4'>
                            <label htmlFor="permanentAddress.city" className='form-label'>City <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="permanentAddress.city"
                                value={formData.permanentAddress?.city || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-lg-4 p-lg-4 mb-sm-3'>
                            <label htmlFor="permanentAddress.pinCode" className='form-label'>PIN Code <span className='text-danger fw-bold'>*</span></label>
                            <input
                                type="text"
                                className='form-control text-secondary'
                                name="permanentAddress.pinCode"
                                value={formData.permanentAddress?.pinCode || ''}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>

                    <div className='row col-lg-12'>
                        <div className='col-md-12 p-lg-4 mb-sm-3'>
                            <input
                                type="checkbox"
                                className='form-check-input'
                                id="sameAsPermanent"
                                checked={isSameAddress}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="sameAsPermanent" className='form-check-label ms-2 text-secondary'>Same as Current Address</label>
                        </div>
                    </div>

                    <div className='row col-lg-12 mb-3' style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        <div className='col-lg-8 text-center'>
                            <Button type="submit" className='btn btn-warning fw-bold text-light' disabled={isLoading}>
                                {isLoading ? 'Updating...' : 'Update Personal'}
                            </Button>
                        </div>
                    </div>

                    
                {success && <Alert variant="success text-center" style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{success}</Alert>}
                {error && <Alert variant="danger text-center" style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{error}</Alert>}

                </form>
            </div>
        </div>
    );
};

export default PersonalEdit;
