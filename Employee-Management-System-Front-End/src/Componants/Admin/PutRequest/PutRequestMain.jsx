import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import PersonalEdit from './PersonalEdite';
import ProfessionalEdit from './ProfessionalEdit';
import FinanceEdit from './FinanceEdite';
import './style.css';

export default function PutRequestMain() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 10;

    // Modals and selected employee state
    const [showModal, setShowModal] = useState(false);
    const [showPersonalEditModal, setShowPersonalEditModal] = useState(false);
    const [showProfessionalEditModal, setShowProfessionalEditModal] = useState(false);
    const [showFinanceEditModal, setShowFinanceEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [updatedEmployee, setUpdatedEmployee] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1010/admin/get-all-employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.statusCode === 200 && response.data.ourEmployeesList) {
                setEmployees(response.data.ourEmployeesList);
            } else {
                // setEmployees([]);
                navigate('/error');
            }
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to fetch employee data');
            navigate('/error');
        } finally {
            setLoading(false);
        }
    };

    const handleShowModal = (employee) => {
        setSelectedEmployee(employee);
        setUpdatedEmployee({ ...employee });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowPersonalEditModal(false);
        setShowProfessionalEditModal(false);
        setShowFinanceEditModal(false);
        setShowDeleteModal(false);
        setSelectedEmployee(null);
        setUpdatedEmployee({});
    };

    const handleUpdateEmployee = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:1010/admin/update/${selectedEmployee.employeeId}`, updatedEmployee, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Employee Details Updated Successfully!');
            handleCloseModal();
            fetchEmployees();
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to update employee data');
        }
    };

    const handleShowDeleteModal = (employee) => {
        setSelectedEmployee(employee);
        setShowDeleteModal(true);
    };

    const handleDeleteEmployee = async (employeeId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:1010/admin/delete/${employeeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchEmployees();
            handleCloseModal();
        } catch (error) {
            setError(error.response ? error.response.data.message : 'Failed to delete employee');
        }
    };

    const filteredEmployees = employees.filter(employee =>
    (employee.employeeId.toString().includes(searchTerm) ||
        employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    return (
        <div className='container-fluid' style={{ position:'relative', left: "10%", width:'75%'}} >
            <div className='row my-3'>
                <div className='col-fixed'>
                    <input
                        type="text"
                        placeholder="Search by Employee ID or Name or Email..."
                        className="form-control "
                        value={searchTerm}
                        style={{boxShadow :'1px 0px 20px rgba(0,0,0,0.2)', padding :'13px', color:'#007c78'}}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className='row'>
                <div className='col'>
                    <table className='table table-hover mt-3 ' style={{boxShadow :'1px 0px 20px rgba(0,0,0,0.2)'}}>
                        <thead>
                            <tr className='text-center'>
                                <th scope='col'>S.No</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Employee Code</th>
                                <th scope='col'>Mail</th>
                                <th scope='col'>Mobile</th>
                                <th scope='col'>Action</th>
                            </tr>
                        </thead>
                        <tbody >
                            {currentEmployees.length === 0 ? (
                                <tr >
                                    <td colSpan="6" className="text-center" style={{ height: '300px' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold',color :'red', marginTop:'10%' }}>
                                            No employees found
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                [...Array(employeesPerPage)].map((_, index) => {
                                    const employee = currentEmployees[index];
                                    return (
                                        <tr key={index} className='text-center' style={{ height: '50px' }}>
                                            <th scope='row'>{employee ? (index + 1) + (currentPage - 1) * employeesPerPage : ' '}</th>                                            <td>{employee ? employee.fullName || ' ' : ' '}</td>
                                            <td>{employee ? employee.employeeId || ' ' : ' '}</td>
                                            <td>{employee ? employee.email : ' '}</td>
                                            <td>{employee ? employee.mobileNumber || ' ' : ' '}</td>
                                            <td>
                                                {employee ? (
                                                    <>
                                                        <button
                                                            className="btn btn-primary me-2 p-1"
                                                            onClick={() => handleShowModal(employee)}
                                                            style={{ width: '40px', height: '40px' }} // Adjust size as needed
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="btn btn-danger p-1"
                                                            onClick={() => handleShowDeleteModal(employee)}
                                                            style={{ width: '40px', height: '40px' }} // Adjust size as needed
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span> </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>

                    {/* Pagination Controls */}
                    <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between">
                        <Button variant="primary" onClick={() => setShowPersonalEditModal(true)} className="me-3">
                            Personal Edit
                        </Button>
                        <Button variant="secondary" onClick={() => setShowProfessionalEditModal(true)} className="me-3">
                            Professional Edit
                        </Button>
                        <Button variant="success" onClick={() => setShowFinanceEditModal(true)}>
                            Finance Edit
                        </Button>
                    </div>
                </Modal.Body>
            
            </Modal>


            {/* Personal Edit Modal */}
            <Modal show={showPersonalEditModal} onHide={handleCloseModal} dialogClassName="fullscreen-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Personal Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PersonalEdit
                        employee={selectedEmployee}
                        updatedEmployee={updatedEmployee}
                        setUpdatedEmployee={setUpdatedEmployee}
                        handleUpdateEmployee={handleUpdateEmployee}
                    />
                </Modal.Body>
            </Modal>

            {/* Professional Edit Modal */}
            <Modal show={showProfessionalEditModal} onHide={handleCloseModal} dialogClassName="fullscreen-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Professional Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProfessionalEdit
                        employee={selectedEmployee}
                        updatedEmployee={updatedEmployee}
                        setUpdatedEmployee={setUpdatedEmployee}
                        handleUpdateEmployee={handleUpdateEmployee}
                    />
                </Modal.Body>
            </Modal>

            {/* Finance Edit Modal */}
            <Modal show={showFinanceEditModal} onHide={handleCloseModal} dialogClassName="fullscreen-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Finance Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FinanceEdit
                        employee={selectedEmployee}
                        updatedEmployee={updatedEmployee}
                        setUpdatedEmployee={setUpdatedEmployee}
                        handleUpdateEmployee={handleUpdateEmployee}
                    />
                </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this employee?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="danger" onClick={() => handleDeleteEmployee(selectedEmployee.employeeId)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
