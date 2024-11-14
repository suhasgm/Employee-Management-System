import { useState, useEffect } from 'react';
import axios from 'axios';
import React from 'react';
import EmployeeIDCard from './EmployeeIDCard';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
  const [employee, setEmployee] = useState({});
  const [projects, setProjects] = useState([]);
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
        setProjects(response.data.ourEmployee.projectDetailsList);
        setEmail(response.data.ourEmployee.email);
      }
      else {
        navigate('/error');
      }

    } catch (error) {
      // console.error('Error fetching employee details:', error);
      setError(error.response ? error.response.data.message || 'Failed to fetch employee details' : 'Failed to fetch employee details');
      navigate('/error');
    } finally {
      setLoading(false);
    }
  };
  // Function to handle payslip download
  const downloadPayslip = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
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


  useEffect(() => {
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
    <div className='container dashboard-container mt-4'>
      {/* Employee ID Card Column */}
      <div >
        {employee && <EmployeeIDCard employee={employee} />}
      </div>

      {/* Project Count and Download Button Column */}
      <div className="col-md-4">
        <button className="Download-button " onClick={downloadPayslip}>
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

    </div>
  );
}
