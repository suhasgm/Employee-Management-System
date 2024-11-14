import React, { useState ,useEffect } from 'react';
import axios from 'axios';
import './CombinedComponent.css'; // Import the combined CSS file

const CombinedComponent = ({ onClose }) => {
    const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state


    
    useEffect(() => {
        // Clear message after 2 seconds
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                if (step === 'reset' && message === 'Password reset successfully.') {
                    onClose(); // Close modal after 2 seconds if reset is successful
                }
            }, 3000);
            return () => clearTimeout(timer); // Clean up the timer
        }
    }, [message, step, onClose]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:1010/auth/forget', { email });
            setMessage(response.data.message);
            if (response.data.statusCode === 200) {
                setStep('verify');
            }
        } catch (error) {
            setMessage('Error sending OTP. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:1010/auth/verify-otp', { email, otp });
            setMessage(response.data.message);
            if (response.data.statusCode === 200) {
                setStep('reset');
            }
        } catch (error) {
            setMessage('Error verifying OTP. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        setLoading(true); // Start loading
        try {
            const response = await axios.post('http://localhost:1010/auth/reset', { email, password: newPassword });
            setMessage(response.data.message);
            if (response.data.statusCode === 200) {
                onClose(); // Close the modal after resetting password
            }
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
            onClose(); 
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div className="containerr">
            <div className="form-box shadow">
                {step === 'request' && (
                    <>
                        <h2>Request OTP</h2>
                        <form className='form' onSubmit={handleRequestOTP}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <label className={email ? 'label active' : 'label'}>Email</label>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <h2>Verify OTP</h2>
                        <form className='form' onSubmit={handleVerifyOTP}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <label className={otp ? 'label active' : 'label'}>OTP</label>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Verify OTP'}
                            </button>
                        </form>
                    </>
                )}

                {step === 'reset' && (
                    <>
                        <h2>Reset Password</h2>
                        <form className='form' onSubmit={handleResetPassword}>
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <label className={newPassword ? 'label active' : 'label'}>New Password</label>
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="input-field"
                                />
                                <label className={confirmPassword ? 'label active' : 'label'}>Confirm Password</label>
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default CombinedComponent;
