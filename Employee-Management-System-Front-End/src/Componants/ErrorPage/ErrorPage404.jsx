import React from 'react';
import errorImg from '@/assets/Error404.png'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
export function ErrorPage404() {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <img src={errorImg} alt="Error" style={styles.image} />
            <button onClick={handleBackToLogin} style={styles.button}>
                Back to Login
            </button>
        </div>
    );
}

// Styles for centering the image and button
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Full viewport height for centering
    },
    image: {
        maxWidth: '80%', // Set maximum width of the image
        maxHeight: '70%', // Set maximum height of the image
        height: 'auto',   // Maintain aspect ratio
        marginBottom: '20px', // Add space below the image
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff', // Bootstrap primary color
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        width: '20%',
        transition: 'background-color 0.3s',
    },
};

// Optional: Add hover effect for button
const hoverStyles = {
    backgroundColor: '#0056b3',
};

export default ErrorPage404;
