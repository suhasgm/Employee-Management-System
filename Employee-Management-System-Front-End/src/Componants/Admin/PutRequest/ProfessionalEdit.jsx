import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Alert } from 'react-bootstrap';

const ProfessionalEdit = ({ employee, onClose }) => {
    const [professional, setProfessional] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [removingIndex, setRemovingIndex] = useState(null); // Track the index of the item being removed



    useEffect(() => {
        if (employee) {
            setProfessional({
                ...employee,
                employmentHistoryList: employee.employmentHistoryList || [],
                projectDetailsList: employee.projectDetailsList || [],
            });
        }
    }, [employee]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
           const response= await axios.put(`http://localhost:1010/admin/update/${professional.employeeId}`, professional, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(response.data.statusCode === 200){
            
            setSuccess('Employee Details Updated Successfully!');
            setError('');
            setTimeout(() => setSuccess(''), 2000);
            setTimeout(() => {
                window.location.reload(); // Reload the page
            }, 4000);
        }
        else{
            setError('Duplicate entry detected: The entry already exists.');
            setTimeout(() => setError(''), 5000);
            // setTimeout(() => {
            //     setError(''); // Clear the error message
            //     window.location.reload(); // Reload the page after error message
            // }, 5000);
            }
        } catch (error) {
            setError('Error updating employee. Please try again.');
            setTimeout(() => setError(''), 5000);
            // setTimeout(() => {
            //     setError(''); // Clear the error message
            //     window.location.reload(); // Reload the page after error message
            // }, 5000);
            // console.error('Error updating employee:', error);
        } finally {
         
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (keys.length === 3 && keys[0] === 'professionalDetails' && keys[1] === 'officeAddress') {
            setProfessional((prev) => ({
                ...prev,
                professionalDetails: {
                    ...prev.professionalDetails,
                    officeAddress: {
                        ...prev.professionalDetails.officeAddress,
                        [keys[2]]: value,
                    },
                },
            }));
        } else {
            const [parent, child] = name.split('.');
            setProfessional((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        }
    };

    const handleEmploymentChange = (index, e) => {
        const { name, value } = e.target;
        const updatedHistory = [...professional.professionalDetails.employmentHistoryList];
        updatedHistory[index][name] = value;
        setProfessional((prev) => ({
            ...prev,
            professionalDetails: {
                ...prev.professionalDetails,
                employmentHistoryList: updatedHistory
            }
        }));
    };
    
    const handleProjectChange = (index, e) => {
        const { name, value } = e.target;
        const updatedProjects = [...professional.projectDetailsList];
        updatedProjects[index][name] = value;
        setProfessional((prev) => ({ ...prev, projectDetailsList: updatedProjects }));
    };

    const handleAddEmployment = () => {
        setProfessional((prev) => ({
            ...prev,
            professionalDetails: {
                ...prev.professionalDetails,
                employmentHistoryList: [
                    ...(prev.professionalDetails?.employmentHistoryList || []),
                    { employmentHistoryId: '', jobTitle: '', companyName: '', joiningDate: '', endingDate: '', jobDescription: '' }
                ]
            }
        }));
    };
    

    const handleRemoveEmployment = async (index, employmentHistoryId) => {
        const token = localStorage.getItem('token');
        setRemovingIndex(index);
        setIsLoading(true);
    
        try {
            // Make the DELETE request to the backend
            const response = await axios.delete(
                `http://localhost:1010/admin/delete/${professional.employeeId}/employmentHistory/${employmentHistoryId}`, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
    
            if (response.data.statusCode === 200) {
                // Clone the current employmentHistoryList deeply
                const updatedHistory = [...professional.professionalDetails.employmentHistoryList].filter((_, i) => i !== index);
                
                // Update the state after successful deletion
                setProfessional((prev) => ({
                    ...prev,
                    professionalDetails: {
                        ...prev.professionalDetails,
                        employmentHistoryList: updatedHistory,
                    },
                }));
    
                setSuccess('Employee History Details Deleted Successfully!');
                setTimeout(() => setSuccess(''), 5000);
                setTimeout(() => setError(''), 5000);
            } else {
                setError('Failed to delete employee history. Please try again.');
            }
        } catch (error) {
            setError('Error deleting employee history. Please try again.');
            setSuccess('');
            console.error('Error deleting employee history:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleAddProject = () => {
        setProfessional((prev) => ({
            ...prev,
            projectDetailsList: [
                ...prev.projectDetailsList,
                { projectCode: '', startDate: '', endDate: '', projectName: '', reportingManagerEmployeeCode: '' },
            ],
        }));
    };

    const handleRemoveProject = async (index, projectDetailsId) => {
        const token = localStorage.getItem('token');
        setRemovingIndex(index);
        setIsLoading(true); 
    
        try {
            // Make the DELETE request to the backend
            const response = await axios.delete(`http://localhost:1010/admin/delete/${professional.employeeId}/project/${projectDetailsId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(response)
            // Check if the response status is 200 (success)
            if (response.data.statusCode === 200) {
                // Filter out the removed item from projectDetailsList
                const updatedProjects = professional.projectDetailsList.filter((_, i) => i !== index);
    
                // Update the state after successfully deleting on the backend
                setProfessional((prev) => ({
                    ...prev,
                    projectDetailsList: updatedProjects
                }));
    
                setSuccess('Project details deleted successfully!');
                setTimeout(() => setSuccess(''), 5000);
                setTimeout(() => setError(''), 5000);
    
            } else {
                // If the status is not 200, handle the error case
                setError('Failed to delete project. Please try again.');
                setIsLoading(false); 
            }
    
        } catch (error) {
            setError('Error deleting project. Please try again.');
            setSuccess('');
            setIsLoading(false); 
            console.error('Error deleting project:', error);
        } finally {
            setIsLoading(false); 
            // Reset loading state after the request completes
        }
    };
    

    return (
        <div className="  row p-lg-4" style={{alignItems : 'center', display :'flex', justifyContent:'center', backgroundColor :'#FAFFFD '}}>
      
            <form onSubmit={handleSubmit} className=" form-control"style={{width:'900px'}}>
                {/* Company Email and Office Phone */}
                <h2 className='form-control  fw-bold mt-2 text-light text-center bg-info p-4' style={{ fontSize: '20px' }}>Professional Details</h2>
                
                <div className="">
                    <div className="row col-lg-12">
                        <div className="col-lg-6 p-lg-4 mb-sm-3">
                            <label htmlFor="companyMail" className="form-label">
                                Company Email <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control text-secondary"
                                name="professionalDetails.companyMail"
                                value={professional.professionalDetails?.companyMail || ''}
                                onChange={handleChange}
                                disabled
                            />
                        </div>
                        <div className="col-lg-6 p-lg-4 mb-sm-3">
                            <label htmlFor="officePhone" className="form-label">
                                Office Phone <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                name="professionalDetails.officePhone"
                                value={professional.professionalDetails?.officePhone || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                 {/* Reporting Manager & HR */}
                 <div className=" ">
                    <div className="row col-lg-12">
                        <div className="col-lg-6 p-lg-4 mb-sm-3">
                            <label htmlFor="reportingManagerEmployeeCode" className="form-label">
                                Reporting Manager Employee Code <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                name="professionalDetails.reportingManagerEmployeeCode"
                                value={professional.professionalDetails?.reportingManagerEmployeeCode || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-lg-6 p-lg-4 mb-sm-3">
                            <label htmlFor="hrName" className="form-label">
                                HR Name <span className="text-danger fw-bold">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control text-secondary"
                                name="professionalDetails.hrName"
                                value={professional.professionalDetails?.hrName || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Office Address */}
                <h2 className='  mt-4  form-control fw-bold text-center  text-light p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px',marginLeft:'10px' }}>Office Address </h2>
                
                <div className="">
                    <div className="row p-lg-4 col-lg-12">
                       
                        {['addressLineI', 'addressLineII', 'city', 'pinCode'].map((field, idx) => (
                            <div key={idx} className={`col-lg-4 p-lg-4 mb-sm-3`}>
                                <label htmlFor={field} className="form-label">
                                    {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-danger fw-bold">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control text-secondary"
                                    name={`professionalDetails.officeAddress.${field}`}
                                    value={professional.professionalDetails?.officeAddress[field] || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>

               

                {/* Employment History Section */}
                <h2 className=' form-control text-center  fw-bold  text-light  p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px', marginLeft:'10px' }}>Employment History</h2>
            
                <div className=" p-lg-4 ">
                    <div className="row col-lg-12">
                      
                        {professional.professionalDetails?.employmentHistoryList?.map((employment, index) => (
                            <div key={index} className="row col-lg-12 border p-3 mb-4"> {/* Added border, padding, and margin */}
                                {['jobTitle', 'companyName', 'joiningDate', 'endingDate', 'jobDescription'].map((field, i) => (
                                    <div key={i} className="col-lg-6 p-lg-4 mb-sm-3">
                                        <label htmlFor={`${field}_${index}`} className="form-label">
                                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <input
                                            type={field.includes('Date') ? 'date' : 'text'}
                                            className="form-control text-secondary"
                                            name={field}
                                            value={employment[field] || ''}
                                            onChange={(e) => handleEmploymentChange(index, e)}
                                        />
                                    </div>
                                ))}
                                <div className="col-lg-6 p-2 text-end mt-5 ">
                                    <Button variant="danger" onClick={() => handleRemoveEmployment(index,employment.employmentHistoryId)} disabled={isLoading === true}>        {isLoading === true ? 'Removing...' : 'Remove'}</Button>
                                </div>
                            </div>
                        ))}
                        <div className="col-lg-4  text-end mb-3">
                            <Button variant="success text-light" onClick={handleAddEmployment}>Add Employment</Button>
                        </div>
                    </div>
                </div>

                {/* Project Details Section */}
                <h2 className=' form-control text-center mt-5 fw-bold  text-light  p-3' style={{ backgroundColor: '#01ad99', width: '40%', fontSize: '18px', marginLeft:'10px' }}>Project details</h2>
            
                <div className="p-lg-4 ">
                    <div className="row col-lg-12">
                       
                        {professional.projectDetailsList?.map((project, index) => (
                            <div key={index} className="row col-lg-12 p-lg-4 border mb-sm-3"> {/* Added border */}
                                {['projectCode', 'startDate', 'endDate', 'projectName', 'reportingManagerEmployeeCode'].map((field, i) => (
                                    <div key={i} className="col-lg-4 p-lg-4 mb-sm-3">
                                        <label htmlFor={`${field}_${index}`} className="form-label">
                                            {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                        <input
                                            type={field.includes('Date') ? 'date' : 'text'}
                                            className="form-control  text-secondary"
                                            name={field}
                                            value={project[field] || ''}
                                            onChange={(e) => handleProjectChange(index, e)}
                                        />
                                    </div>
                                ))}
                                <div className="col-lg-4 p-1 mt-5 text-end ">
                                    <Button variant="danger" onClick={() => handleRemoveProject(index,project.projectDetailsId)} disabled={isLoading === true}>{isLoading === true ? 'Removing...' : 'Remove'}</Button>
                                </div>
                            </div>
                        ))}
                        <div className="col-lg-4  text-end mt-4">
                            <Button variant="success  text-light" onClick={handleAddProject}>Add Project</Button>
                        </div>
                    </div>
                </div>

                <div className=" p-lg-4 row mt-3 mb-2 col-lg-12 " style={{alignItems : 'center', display :'flex', justifyContent:'center'}}>
                    <div className="col-lg-6 text-end">
                        <Button type="submit" variant="warning text-light  fw-bold" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Professional'}
                        </Button>
                    </div>
                </div>

                {success && <Alert variant="success text-center"style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{success}</Alert>}
                {error && <Alert variant="danger text-center" style={{width:'868px',  marginTop:'20px', marginLeft:'10px'}}>{error}</Alert>}

            </form>
        </div>
    );
};

export default ProfessionalEdit;
