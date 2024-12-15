import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase'; // Import Firebase auth and Firestore
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase function to sign in users
import { getDocs, query, collection, where } from 'firebase/firestore'; // Firestore functions for querying
import './Login.css';
import buddyBakingLogo from 'C:/Users/Ivanhoe/AndroidStudioProjects/baking-buddy-web/src/components/buddybaking.png'; // Adjusted path to your logo

const Login = () => {
    const [formData, setFormData] = useState({
        identifier: '', // Input for email or username
        password: '',
    });

    const [error, setError] = useState(''); // To hold any error messages
    const [loading, setLoading] = useState(false); // To indicate login process

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { identifier, password } = formData;

        setLoading(true); // Show loading state
        setError(''); // Clear previous error messages

        try {
            let email = identifier;

            // If identifier is not an email, assume it's a username and fetch email
            if (!identifier.includes('@')) {
                const usersRef = collection(firestore, 'users');
                const usernameQuery = query(usersRef, where('username', '==', identifier));
                const querySnapshot = await getDocs(usernameQuery);

                if (querySnapshot.empty) {
                    throw new Error('No account found with this username.');
                }

                // Extract email from the first document (assuming username is unique)
                email = querySnapshot.docs[0].data().email;
            }

            // Authenticate with the determined email and password
            await signInWithEmailAndPassword(auth, email, password);

            alert('You have successfully logged in!');
            navigate('/dashboard'); // Redirect to dashboard after successful login
        } catch (error) {
            console.error('Error during login:', error.message);
            setError(
                error.message.includes('user-not-found') || error.message.includes('username')
                    ? 'Invalid username or email.'
                    : 'Invalid password. Please try again.'
            );
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <img src={buddyBakingLogo} alt="Buddy Baking Logo" className="logo" />
                <h1 className="title">Sign In</h1>

                {/* Display error message if any */}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text" // Allow input for either email or username
                        name="identifier"
                        className="input-field"
                        placeholder="Email or Username"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        className="input-field"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <p className="redirect-text">
                    Don't have an account yet?{' '}
                    <Link to="/register" className="link">Register</Link>
                </p>
                <p className="info-text">
                    You can log in using either your <strong>email</strong> or <strong>username</strong>.
                </p>
            </div>
        </div>
    );
};

export default Login;
