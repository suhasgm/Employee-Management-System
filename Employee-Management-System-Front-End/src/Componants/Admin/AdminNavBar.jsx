import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { FaHome, FaUser, FaBriefcase, FaDollarSign, FaSignOutAlt, FaProjectDiagram, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePic from './ProfilePic';


const AdminNavBar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // State to store the username
  const [role, setRole] = useState('Employee'); // Default role is 'Employee'
  const [gender, setGender] = useState(null); // Default role is 'Employee'
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [hoveredLink, setHoveredLink] = useState(null); // State to track hovered link
  const [activeLink, setActiveLink] = useState('dashboard'); // State to track active link


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.statusCode) {

          const { fullName, role, gender } = response.data.ourEmployee;
          setUsername(fullName);
          setRole(role);
          setGender(gender);
          setLoading(false);
        } else {
          
          navigate('/error');
        }
      } catch (error) {
        // console.error('Error fetching profile:', error);
        setError('Failed to fetch profile. Please try again later.');
        setLoading(false);
        navigate('/error');
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: <FaHome className="me-2" />, label: 'Dashboard', key: 'dashboard' },
    { to: '/admin/new-employee', icon: <FaUser className="me-2" />, label: 'New Employee', key: 'new-employee' },
    { to: '/admin/all-employees', icon: <FaBriefcase className="me-2" />, label: 'Employees List', key: 'employees-list' },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-light d-flex flex-column align-items-center" style={{ height: '100vh', width: '250px', position: 'fixed', top: 0, left: 0, overflowY: 'auto', background: 'linear-gradient(200deg, rgba(0,212,255,1) 0%, rgba(9,9,121,1) 91%, rgba(2,0,36,1) 100%)', boxShadow: '2px 0 70px rgba(0, 0, 0, 0.7)' }}>
        <div className="text-center p-3 d-flex flex-column align-items-center" style={{ marginBottom: '30px', color: '#F0F0F0' }}>
          {/* Profile Pic Uploader */}
          <ProfilePic gender={gender} />
          <p className="mb-0 fs-3">{username}</p>
          <p className="mb-0">{role}</p>
        </div>
        <ul className="nav flex-column">
          {navLinks.map(({ to, icon, label, key }) => (
            <li className="nav-item p-2" key={key}>
              <NavLink
                className="nav-link"
                to={to}
                end
                activeClassName="active"
                onMouseEnter={() => setHoveredLink(key)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => setActiveLink(key)}
                style={{
                  color: hoveredLink === key || activeLink === key ? '#FFD700' : '#F0F0F0', // Gold for hover and active
                  transition: 'color 0.3s',
                }}
              >
                {icon} {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '130px' }}>
          <ul className="nav flex-column">
            <li className="nav-item p-2 mt-5">
              <button className="nav-link" onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#F0F0F0', cursor: 'pointer' }}>
                <FaSignOutAlt className="me-2 fs-4 text-light" /> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavBar;
