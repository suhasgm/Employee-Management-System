import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { useNavigate } from 'react-router-dom';
import Forgot from '@/assets/forgot.png';



const PasswordReset = () => {
    const navigatee = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const fetchEmployeeDetails = async () => {
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            const response = await axios.get('http://localhost:1010/adminuser/get-profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.statusCode === 200) {

                setEmail(response.data.ourEmployee.email);
            }
            else {
                navigate('/error');
            }

        } catch (error) {
            console.error('Error fetching employee details:', error);
            setMessage(error.response ? error.response.data.message || 'Failed to fetch employee details' : 'Failed to fetch employee details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:1010/auth/resetPassword', { email, password: newPassword });
            setMessage(response.data.message);

            if (response.data.statusCode === 200) {
                setMessage("Password reset successfully.");

                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                navigatee('/login');
            }
        } catch (error) {
            setMessage('Error resetting password. Please try again.' + error);
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" >
            <div className="row col-lg-12 w-100 ">

                <div className="col-lg-6 d-none d-md-flex justify-content-center  align-items-center">
                    <img src={Forgot} alt="Forgot Password" style={{ maxWidth: '80%' }} />
                </div>

                <div className="card shadow-lg p-4 rounded-3" style={{ width: '350px', top: '8%', left: '2%', height: '400px' }}>
                    <h3 className="card-title text-center mb-4">Reset Password</h3>
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group mb-3">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Sending...' : 'Reset Password'}
                        </button>
                    </form>
                    {message && <div className="alert alert-info mt-3">{message}</div>}
                </div>
            </div>
        </div>
    );
};

export default PasswordReset;
