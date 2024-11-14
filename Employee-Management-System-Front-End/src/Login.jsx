import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import axios from "axios";
import { Link, useNavigate} from "react-router-dom"; 
import Logo from '@/assets/Logo.png';
import './Login.css';
import CombinedComponent from "./Componants/ForgotPassword/CombinedComponent.jsx";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);  // Modal state
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        const userRole = localStorage.getItem('role');
        if (loggedInUser && userRole) {
            navigate(userRole === `ADMIN` ? '/admin' : '/user');
        }
    }, [navigate]);

    // Yup schema for form validation
    const userSchema = yup.object().shape({
        email: yup.string().email('Invalid Email ID').required('Enter Your ID'),
        password: yup.string().min(4, 'Password must be at least 4 characters').required('Enter Your Password')
    });

    // Handle form validation and submission
    async function formValidate(event) {
        event.preventDefault();
        setError({});
        setLoading(true);

        try {
            await userSchema.validate({ email, password }, { abortEarly: false });

            try {
                const response = await axios.post('http://localhost:1010/auth/login', {
                    email,
                    password
                });

                const { statusCode, role, token } = response.data;

                if (statusCode === 200) {
                    localStorage.setItem('username', email);
                    localStorage.setItem('role', role);
                    localStorage.setItem('token', token);
                    navigate(role === "ADMIN" ? "/admin" : "/user");
                } else {
                    setError("Check Your Mail & Password");
                }

            } catch (axiosError) {
                if (axiosError.response) {
                    setError("Error logging in. Please try again.");
                } else {
                    setError("Network error. Please check your connection.");
                }
            } finally {
                setLoading(false);
            }

        } catch (validationError) {
            const errorMessage = {};
            if (validationError.inner) {
                validationError.inner.forEach((e) => {
                    errorMessage[e.path] = e.message;
                });
            }
            setError(errorMessage);
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <div className="row w-100 min-vh-100">
                <div className="col-lg-6 col-md-6 mb-2 mb-sm-0">
                    <div className="img-box text-center">
                        <img src={Logo} className="img-fluid" alt="Login" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </div>

                <div className="log-box col-lg-6 col-md-6">
                    <div className="login-box p-5">
                        <form onSubmit={formValidate}>
                            <div className="text-center mb-4">
                                <h4 className="fw-bold">Login</h4>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="userId" className="form-label">User ID</label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Enter Your Email ID"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="text-danger">{error.email}</div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="text-danger">{error.password}</div>
                            </div>

                            <div className="text-danger mt-3 error-line">
                                {typeof error === 'string' && <span>{error}</span>}
                            </div>

                            <div className="mt-4">
                                <button
                                    className="btn btn-warning w-100 mt-3"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                            {/* Reset Password Link */}
                            <div className="mt-3 text-center">
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setShowModal(true)} // Show modal on click
                                >
                                    Forgot Password?
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Forgot Password</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">

                            
                                {/* <RequestOTP setEmail={setEmail} /> */}
                                <CombinedComponent onClose={() => setShowModal(false)} ></CombinedComponent>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;
