import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import buddyBakingLogo from 'C:/Users/Ivanhoe/AndroidStudioProjects/baking-buddy-web/src/components/buddybaking.png';
import { auth, firestore } from '../firebase'; // Firebase configuration file
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase function to create users
import { doc, setDoc } from 'firebase/firestore'; // Firestore functions

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repassword: '',
    });
    const [loading, setLoading] = useState(false); // Loading state to manage button click
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password, repassword } = formData;

        // Check if passwords match
        if (password !== repassword) {
            alert('Passwords do not match.');
            return;
        }

        // Validate username
        if (!username.trim()) {
            alert('Username cannot be empty.');
            return;
        }

        setLoading(true); // Show loading state
        try {
            // Create a user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Get the user object
            const user = userCredential.user;

            // Save username and email to Firestore
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, {
                username: username.trim(),
                email: email,
            });

            alert('You have successfully registered an account!');
            navigate('/login'); // Redirect to the login page after successful registration
        } catch (error) {
            console.error('Error during registration:', error);
            // More specific error handling for Firebase errors
            if (error.code === 'auth/email-already-in-use') {
                alert('Email already in use.');
            } else if (error.code === 'auth/weak-password') {
                alert('Password is too weak.');
            } else {
                alert('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="registration-container">
            <div className="form-wrapper">
                <img src={buddyBakingLogo} alt="Buddy Baking Logo" className="logo" />
                <h1 className="title">Sign Up</h1>
                <form onSubmit={handleSubmit} className="form">
                    <input
                        type="text"
                        name="username"
                        className="input-field"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        className="input-field"
                        placeholder="Email"
                        value={formData.email}
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
                    <input
                        type="password"
                        name="repassword"
                        className="input-field"
                        placeholder="Re-enter Password"
                        value={formData.repassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="redirect-text">
                    Have an account already?{' '}
                    <Link to="/login" className="link">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
