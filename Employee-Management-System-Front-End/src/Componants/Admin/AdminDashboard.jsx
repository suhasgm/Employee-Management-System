import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import EmployeeIDCard from '../Employee/EmployeeIDCard';
import Logo from "@/assets/Logo.png";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [employee, setEmployee] = useState({});
  const [EmployeeList, setEmployeeList] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.statusCode === 200) {

        setEmployee(response.data.ourEmployee);
        setEmail(response.data.ourEmployee.email);

      }
      else {
        navigate('/error');
      }
    } catch (error) {
      // console.error('Error fetching employee details:', error);
      navigate('/error');
      setError(error.response ? error.response.data.message || 'Failed to fetch employee details' : 'Failed to fetch employee details');
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:1010/admin/get-all-employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      if (response.data.statusCode === 200 && response.data.ourEmployeesList) {
        setEmployeeList(response.data.ourEmployeesList);
      } else {
        // setEmployeeList([]);
        navigate('/error');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Failed to fetch employee data');
      navigate('/error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeDetails();
    fetchEmployees();
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
    <div className='container dashboard-container mt-4'>

      {/* <div className='row' style={{height:'30px', position :'sticky'}}>
        <img src={Logo}  className='img img-fluid ' alt="" />

      </div> */}

      <div className="row">
        {/* Employee ID Card Column */}
        <div className="col-md-8">
          {employee && <EmployeeIDCard employee={employee} />}
        </div>

        {/* Project Count and Download Button Column */}
        {/* <div className="col-md-4">
          <div className="project-count-card">
            <h2>Employee Count</h2>
            <p>{EmployeeList.length}</p>
          </div>

        </div> */}

      </div>
    </div>
  );
}
