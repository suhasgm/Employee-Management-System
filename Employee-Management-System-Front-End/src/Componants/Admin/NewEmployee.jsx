import React, { useState } from 'react';
import axios from 'axios';
import * as Yup from 'yup'; // Import Yup for validation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Alert } from 'react-bootstrap';

const AddEmployee = () => {
    const initialEmployeeState = {
        email: '',
        role: '',
        fullName: '',
        gender: '',
        age: '',
        dateOfBirth: '',
        mobileNumber: '',
        currentAddress: {
            city: '',
            addressLineI: '',
            addressLineII: '',
            pinCode: ''
        },
        permanentAddress: {
            city: '',
            addressLineI: '',
            addressLineII: '',
            pinCode: ''
        },
        emergencyContactName: '',
        emergencyContactNumber: '',
        professionalDetails: {
            companyMail: '',
            officePhone: '',
            officeAddress: {
                city: '',
                addressLineI: '',
                addressLineII: '',
                pinCode: ''
            },
            reportingManagerEmployeeCode: '',
            hrName: '',
            dateOfJoining: '',
            employmentHistoryList: [
                {
                    employmentHistoryId: '',
                    jobTitle: '',
                    companyName: '',
                    joiningDate: '',
                    endingDate: '',
                    jobDescription: ''
                },
            ]
        },
        projectDetailsList: [
            {
                projectCode: '',
                startDate: '',
                endDate: '',
                projectName: '',
                reportingManagerEmployeeCode: ''
            },
        ],
        finance: {
            panCard: '',
            aadharCard: '',
            bankDetails: {
                bankName: '',
                branch: '',
                ifsccode: ''
            },
            ctcBreakup: {
                basicSalary: '',
                hra: '',
                providentFund: '',
                specialAllowance: '',
                bonus: '',
                otherBenefits: '',
                totalCTC: ''
            }
        }
    }
    const [employee, setEmployee] = useState(initialEmployeeState);

    const [isSameAddress, setIsSameAddress] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        const fields = name.split('.');
        let current = employee;

        fields.forEach((field, index) => {
            if (index === fields.length - 1) {
                current[field] = value;
            } else {
                current = current[field];
            }
        });

        setEmployee({ ...employee });
    };

    const handleCheckboxChange = () => {
        setIsSameAddress(!isSameAddress);
        if (!isSameAddress) {
            // Copy current address to permanent address
            setEmployee((prev) => ({
                ...prev,
                permanentAddress: { ...prev.currentAddress }
            }));
        } else {
            // Clear permanent address
            setEmployee((prev) => ({
                ...prev,
                permanentAddress: {
                    city: '',
                    addressLineI: '',
                    addressLineII: '',
                    pinCode: ''
                }
            }));
        }
    };

    // Yup validation schema
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        fullName: Yup.string().required('Full Name is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the employee data
        try {
            await validationSchema.validate(employee, { abortEarly: false });
        } catch (validationError) {
            setError(validationError.errors.join(', ')); // Set validation error in state
            setTimeout(() => setError(''), 5000);
            return;
        }

        const token = localStorage.getItem('token'); // Retrieve auth token
        console.log('Submitting employee data:', employee); // Log the employee data

        try {
            const response = await axios.post('http://localhost:1010/auth/register', employee, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.statusCode === 200) {
                setSuccess('Employee Added Successfully');
                setEmployee(initialEmployeeState);
                setTimeout(() => setSuccess(''), 5000);
                setTimeout(() => setError(''), 5000);

                // setSuccess('');
                // setError('');
                // setTimeout(onClose, 2000); // Close modal after 2 seconds
                // window.location.reload();
                // Trigger a state update instead of full page reload
            } else {
                // console.log(response.data.message);
                setError("Employee Not Updated..! Check The Details");
                setTimeout(() => setError(''), 5000);
            }
        } catch (error) {
            // Enhanced error handling
            if (error.response) {
                setError(`Server Error Please try again`);
                console.log(error);
            } else {
                setError('Network error occurred. Please check your connection and try again.');
            }
        }
    };


    const handleAddEmployment = () => {
        setEmployee((prev) => ({
            ...prev,
            professionalDetails: {
                ...prev.professionalDetails,
                employmentHistoryList: [
                    ...prev.professionalDetails.employmentHistoryList,
                    {
                        employmentHistoryId: '',
                        jobTitle: '',
                        companyName: '',
                        joiningDate: '',
                        endingDate: '',
                        jobDescription: ''
                    }
                ]
            }
        }));
    };

    const handleRemoveEmployment = (index) => {
        setEmployee((prev) => ({
            ...prev,
            professionalDetails: {
                ...prev.professionalDetails,
                employmentHistoryList: prev.professionalDetails.employmentHistoryList.filter((_, i) => i !== index)
            }
        }));
    };

    const handleAddProject = () => {
        setEmployee((prev) => ({
            ...prev,
            projectDetailsList: [
                ...prev.projectDetailsList,
                {
                    projectCode: '',
                    startDate: '',
                    endDate: '',
                    projectName: '',
                    reportingManagerEmployeeCode: ''
                }
            ]
        }));
    };

    const handleRemoveProject = (index) => {
        setEmployee((prev) => ({
            ...prev,
            projectDetailsList: prev.projectDetailsList.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="container d-flex justify-content-center " style={{ position: 'relative', top: 10, left: "10%", width: '85%' }}>
            <div className="row p-4">


                <form onSubmit={handleSubmit} style={{ width: '1100px' }}>
                    <h2 className=' form-control mt-3  fw-bold  text-light bg-info p-4'>New Employee Registration</h2>
                    {/* Employee Name */}
                    <div className="form-control mb-5">
                        <div className="row col-lg-12 mb-lg-0 mb-sm-3 mt-3">
                            <div className="col-lg-4 mb-lg-0 mb-sm-3 p-lg-4">
                                <label htmlFor="fullName" className="form-label">Employee Name <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" placeholder="Enter Your Full Name" name="fullName" value={employee.fullName} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="role" className="form-label">Role <span className="text-danger fw-bold">*</span></label>
                                <select name="role" className="form-control" value={employee.role} onChange={handleChange} required>
                                    <option value="">Select Role </option>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="dateOfBirth" className="form-label">Date Of Birth <span className="text-danger fw-bold">*</span></label>
                                <input type="date" className="form-control" name="dateOfBirth" value={employee.dateOfBirth} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Mobile Number and Email */}
                        <div className="row col-lg-12">
                            <div className="col-md-6 col-lg-4 p-lg-4">
                                <label className="form-label">Gender  <span className="text-danger fw-bold">*</span></label>
                                <select name="gender" className="form-control" value={employee.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="mobileNumber" className="form-label">Mobile Number <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" placeholder="Enter Mobile Number" name="mobileNumber" value={employee.mobileNumber} onChange={handleChange} required
                                    maxlength="10"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="email" className="form-label">Email <span className="text-danger fw-bold">*</span></label>
                                <input type="email" className="form-control" placeholder="Enter Email" name="email" value={employee.email} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="row col-lg-12">
                            <div className="col-lg-6 p-lg-4">
                                <label htmlFor="emergencyContactName" className="form-label">Emergency Contact Name <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" placeholder="Enter Emergency Contact Name" name="emergencyContactName" value={employee.emergencyContactName} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-6 p-lg-4">
                                <label htmlFor="emergencyContactNumber" className="form-label">Emergency Contact Number <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" placeholder="Enter Emergency Contact Number" name="emergencyContactNumber" value={employee.emergencyContactNumber} onChange={handleChange} required
                                    maxlength="10"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }}
                                />
                            </div>
                        </div>
                        <h4 className='  mt-3 fw-bold text-secondary p-3'>Current Address Details</h4>




                        {/* Current Address */}
                        <div className="row col-lg-12">


                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="currentAddress .addressLineI" className="form-label">Address Line 1 <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="currentAddress.addressLineI" placeholder="2916 Main St" value={employee.currentAddress.addressLineI} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="currentAddress.addressLineII" className="form-label">Address Line 2 <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="currentAddress.addressLineII" placeholder="Apartment, studio, or floor" value={employee.currentAddress.addressLineII} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="currentAddress.city" className="form-label">City <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="currentAddress.city" placeholder="Enter City" value={employee.currentAddress.city} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="currentAddress.pinCode" className="form-label">Pin Code <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="currentAddress.pinCode" placeholder="Enter 6 Digit PIN" value={employee.currentAddress.pinCode} onChange={handleChange} required
                                    maxlength="6"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }} />
                            </div>
                        </div>

                        {/* Permanent Address */}
                        <h2 className='  mt-3  fw-bold  text-secondary  p-3'>Permanent Address Details</h2>

                        <div className="row col-lg-12">

                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="permanentAddress.addressLineI" className="form-label">Address Line 1 <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="permanentAddress.addressLineI" placeholder="2916 Main St" value={employee.permanentAddress.addressLineI} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="permanentAddress.addressLineII" className="form-label">Address Line  2 <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="permanentAddress.addressLineII" placeholder="Apartment, studio, or floor" value={employee.permanentAddress.addressLineII} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="permanentAddress.city" className="form-label">City <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="permanentAddress.city" placeholder="Enter City" value={employee.permanentAddress.city} onChange={handleChange} required />
                            </div>
                            <div className="col-lg-4 p-lg-4">
                                <label htmlFor="permanentAddress.pinCode" className="form-label">Pin Code <span className="text-danger fw-bold">*</span></label>
                                <input type="text" className="form-control" name="permanentAddress.pinCode" placeholder="Enter 6 Digit PIN" value={employee.permanentAddress.pinCode} onChange={handleChange} required
                                    maxlength="6"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                    }} />
                            </div>
                        </div>

                        {/* Checkbox for same address */}
                        <div className="form-check ps-5 mb-4 mt-2">
                            <input type="checkbox" className="form-check-input mt-1" id="sameAddress" checked={isSameAddress} onChange={handleCheckboxChange} />
                            <label className="form-check-label text-secondary " htmlFor="sameAddress">Permanent Address is same as Current Address</label>
                        </div>

                        <h2 className=' form-control mt-5  fw-bold  text-light bg-warning p-4'>Professional Details</h2>


                        {/* Professional Details */}
                        <div className=" mb-5">
                            <div className="row col-lg-12">
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="companyMail" className="form-label">Company Email <span className="text-danger fw-bold">*</span></label>
                                    <input type="email" className="form-control" name="professionalDetails.companyMail" value={employee.professionalDetails.companyMail} placeholder='Company Email' onChange={handleChange} required />
                                </div>
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="officePhone" className="form-label">Office Phone <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="professionalDetails.officePhone" value={employee.professionalDetails.officePhone} placeholder='Office Phone' onChange={handleChange} required
                                        maxlength="10"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                    />
                                </div>

                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="reportingManagerEmployeeCode" className="form-label">Reporting Manager Employee Code <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="professionalDetails.reportingManagerEmployeeCode" value={employee.professionalDetails.reportingManagerEmployeeCode} placeholder='Reporting Manager Employee Code ' onChange={handleChange} required />
                                </div>
                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="hrName" className="form-label">HR Name <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="professionalDetails.hrName" value={employee.professionalDetails.hrName} placeholder='HR Name' onChange={handleChange} required />
                                </div>
                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="dateOfJoining" className="form-label">Date of Joining <span className="text-danger fw-bold">*</span></label>
                                    <input type="date" className="form-control" name="professionalDetails.dateOfJoining" value={employee.professionalDetails.dateOfJoining} onChange={handleChange} required />
                                </div>
                            </div>

                            {/* Office Address */}
                            <h2 className='  fw-bold  text-secondary  p-3'>Office Address</h2>

                            <div className="row col-lg-12 mt-3 ">

                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="officeAddress.addressLineI" className="form-label">Address Line I <span className="text-danger fw-bold">*</span ></label>
                                    <input type="text" className="form-control" name="professionalDetails.officeAddress.addressLineI" placeholder="2916 Main Road" value={employee.professionalDetails.officeAddress.addressLineI} onChange={handleChange} required />
                                </div>
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="officeAddress.addressLineII" className="form-label">Address Line II</label>
                                    <input type="text" className="form-control" name="professionalDetails.officeAddress.addressLineII" placeholder="Apartment, studio, or floor" value={employee.professionalDetails.officeAddress.addressLineII} onChange={handleChange} required />
                                </div>
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="officeAddress.city" className="form-label">City <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="professionalDetails.officeAddress.city" placeholder="City" value={employee.professionalDetails.officeAddress.city} onChange={handleChange} required />
                                </div>
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="officeAddress.pinCode" className="form-label">Pin Code <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="professionalDetails.officeAddress.pinCode" placeholder="6 Digit PIN" value={employee.professionalDetails.officeAddress.pinCode} onChange={handleChange} required
                                        maxlength="6"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }} />
                                </div>
                            </div>

                            {/* Employment History */}
                            <h2 className='   fw-bold  text-secondary p-3'>Employement History</h2>

                            <div className="row col-lg-12 p-3 ">
                                {employee.professionalDetails.employmentHistoryList.map((history, index) => (
                                    <div key={index} className="row col-lg-12 border mb-5 ms-2">

                                        <div className="col-lg-4 p-lg-3 mb-sm -3">
                                            <label className="form-label">Job Title <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`professionalDetails.employmentHistoryList.${index}.jobTitle`} value={history.jobTitle} placeholder='Job Title' onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-3 mb-sm-3">
                                            <label className="form-label">Company Name <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`professionalDetails.employmentHistoryList.${index}.companyName`} value={history.companyName} placeholder='Company Name' onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-3 mb-sm-3">
                                            <label className="form-label">Joining Date <span className="text-danger fw-bold">*</span></label>
                                            <input type="date" className="form-control" name={`professionalDetails.employmentHistoryList.${index}.joiningDate`} value={history.joiningDate} onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-3 mb-sm-3">
                                            <label className="form-label">Ending Date <span className="text-danger fw-bold">*</span></label>
                                            <input type="date" className="form-control" name={`professionalDetails.employmentHistoryList.${index}.endingDate`} value={history.endingDate} onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-3 mb-sm-3">
                                            <label className="form-label">Job Description <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`professionalDetails.employmentHistoryList.${index}.jobDescription`} value={history.jobDescription} placeholder='Job Description' onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-12 text-center  d-flex justify-content-end mt-2 mb-4" style={{ width: '100%' }}>
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveEmployment(index)} style={{ width: '50%' }}>Remove Employment</button>
                                        </div>
                                    </div>

                                ))}
                                <div className="col-lg-4 text-start">
                                    <button type="button" className="btn btn-success " onClick={handleAddEmployment}>Add Employment</button>
                                </div>
                            </div>

                            {/* Project Details */}
                            <h2 className='   fw-bold  text-secondary mt-4 p-3'>Project Details</h2>

                            <div className="row col-lg-12 mt-3 p-3">
                                {employee.projectDetailsList.map((project, index) => (
                                    <div key={index} className="row col-lg-12 border  mb-5 ms-2">
                                        <div className="col-lg-4 p-lg-4 mb-sm-3">
                                            <label className="form-label">Project Code <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`projectDetailsList.${index}.projectCode`} value={project.projectCode} placeholder='Project Code' onChange={handleChange} required
                                                onInput={(e) => {
                                                    // Remove non-numeric characters
                                                    const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                                    // Limit input to a maximum of 10 digits
                                                    if (inputValue.length <= 10) {
                                                        e.target.value = inputValue; // Set the filtered value
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-4 p-lg-4 mb-sm-3">
                                            <label className="form-label">Project Name <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`projectDetailsList.${index}.projectName`} value={project.projectName} placeholder='Project Name' onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-4 mb-sm-3">
                                            <label className="form-label">Start Date <span className="text-danger fw-bold">*</span></label>
                                            <input type="date" className="form-control" name={`projectDetailsList.${index}.startDate`} value={project.startDate} onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-4 mb-sm-3">
                                            <label className="form-label">End Date <span className="text-danger fw-bold">*</span></label>
                                            <input type="date" className="form-control" name={`projectDetailsList.${index}.endDate`} value={project.endDate} onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-4 p-lg-4 mb-sm-3">
                                            <label className="form-label">Reporting Manager Employee Code <span className="text-danger fw-bold">*</span></label>
                                            <input type="text" className="form-control" name={`projectDetailsList.${index}.reportingManagerEmployeeCode`} value={project.reportingManagerEmployeeCode} placeholder='Reporting Manager Employee Code ' onChange={handleChange} required />
                                        </div>
                                        <div className="col-lg-12 text-center  d-flex justify-content-end mt-2 mb-4" style={{ width: '100%' }}>
                                            <button type="button" className="btn btn-danger" onClick={() => handleRemoveProject(index)} style={{ width: '50%' }}>Remove Project</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-lg-4 mb-5 text-start">
                                    <button type="button" className="btn  btn-success" onClick={handleAddProject}>Add Project</button>
                                </div>
                            </div>
                        </div>

                        {/* Finance Details */}
                        <h2 className=' form-control mt-5  fw-bold  text-light bg-warning p-4'>Finance Details</h2>


                        <div className=" mb-5">

                            <div className="row col-lg-12">
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="panCard" className="form-label">PAN Card <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.panCard" value={employee.finance.panCard} placeholder='PAN - 10 Digit Number ( GOKUL2916S )' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Allow both letters and digits but limit to 10 characters
                                            const inputValue = e.target.value;
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Update input value
                                            } else {
                                                e.target.value = inputValue.slice(0, 10); // Trim to 10 characters
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-6 p-lg-4 mb-sm-3">
                                    <label htmlFor="aadharCard" className="form-label">Aadhaar Card <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.aadharCard" value={employee.finance.aadharCard} placeholder='12 Digits ( Numbers Only )' onChange={handleChange} required
                                        maxlength="12"
                                        onInput={(e) => {
                                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                        }}
                                    />
                                </div>
                            </div>
                            <h2 className='  fw-bold  text-secondary p-3'>Bank  Details</h2>


                            <div className="row col-lg-12">

                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="bankDetails.bankName" className="form-label">Bank Name <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.bankDetails.bankName" value={employee.finance.bankDetails.bankName} placeholder='Bank Name' onChange={handleChange} required />
                                </div>
                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="bankDetails.branch" className="form-label">Branch <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.bankDetails.branch" value={employee.finance.bankDetails.branch} placeholder='Branch ' onChange={handleChange} required />
                                </div>
                                <div className="col-lg-4 p-lg-4 mb-sm-3">
                                    <label htmlFor="bankDetails.ifsccode" className="form-label">IFSC Code <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.bankDetails.ifsccode" value={employee.finance.bankDetails.ifsccode} placeholder='IFSC Code' onChange={handleChange} required />
                                </div>
                            </div>
                            <h2 className='  fw-bold  text-secondary p-3'>CTC Breakup</h2>


                            <div className="row col-lg-12">

                                <div className="col-lg-6 mt-2 ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.basicSalary" className="form-label">Basic Salary <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.basicSalary" value={employee.finance.ctcBreakup.basicSalary} placeholder='Basic Salary' onChange={handleChange} required

                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-6  mt-2 ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.hra" className="form-label">HRA <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.hra" value={employee.finance.ctcBreakup.hra} placeholder='HRA' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row col-lg-12">
                                <div className="col-lg-6 mt-2  ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.providentFund" className="form-label">Provident Fund <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.providentFund" value={employee.finance.ctcBreakup.providentFund} placeholder='Provident Fund' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-6 mt-2  ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.specialAllowance" className="form-label">Special Allowance <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.specialAllowance" value={employee.finance.ctcBreakup.specialAllowance} placeholder='Special Allowance' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row col-lg-12">
                                <div className="col-lg-6  mt-2 ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.bonus" className="form-label">Bonus <span className="text-danger fw-bold">*</span ></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.bonus" value={employee.finance.ctcBreakup.bonus} placeholder='Bonus' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-lg-6  mt-2 ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.otherBenefits" className="form-label">Other Benefits <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.otherBenefits" value={employee.finance.ctcBreakup.otherBenefits} placeholder='Other Benefits' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="row col-lg-12">
                                <div className="col-lg-6 mt-2 ps-4 mb-sm-3">
                                    <label htmlFor="ctcBreakup.totalCTC" className="form-label">Total CTC <span className="text-danger fw-bold">*</span></label>
                                    <input type="text" className="form-control" name="finance.ctcBreakup.totalCTC" value={employee.finance.ctcBreakup.totalCTC} placeholder='Total CTC' onChange={handleChange} required
                                        onInput={(e) => {
                                            // Remove non-numeric characters
                                            const inputValue = e.target.value.replace(/[^0-9]/g, '');
                                            // Limit input to a maximum of 10 digits
                                            if (inputValue.length <= 10) {
                                                e.target.value = inputValue; // Set the filtered value
                                            }
                                        }}
                                    />
                                </div>
                            </div>


                            <div className=" p-lg-4 row col-lg-12 mt-5" style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>

                                <div className=" col-lg-12 text-center mt-3 ">
                                    <button type="submit" className="btn btn-info text-light fw-bold col-lg-4" >Register New Employee</button>
                                </div>
                            </div>

                        </div>

                        {success ? (
                            <Alert variant="success" style={{ width: '868px' }}>{success}</Alert>
                        ) : error && (
                            <Alert variant="danger" style={{width:'868px'}}>{error}</Alert>
                        )}


                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;