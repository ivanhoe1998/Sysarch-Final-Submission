import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';  // Use 'firestore' instead of 'db'
import { doc, getDoc, setDoc } from 'firebase/firestore';  // Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        dob: '',
        username: '',
    });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    // Fetch user profile data from Firestore
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userRef = doc(firestore, 'users', auth.currentUser.uid);  // Use 'firestore' instead of 'db'
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            } catch (error) {
                setError('Failed to load profile data.');
            }
        };
        fetchUserProfile();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Save updated profile data only when "Save" is clicked
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        console.log("Form Submitted");  // Debugging log to ensure it only happens after clicking "Save"
        try {
            const userRef = doc(firestore, 'users', auth.currentUser.uid);  // Use 'firestore' instead of 'db'
            await setDoc(userRef, userData, { merge: true });
            alert('Profile updated successfully!');
            setEditing(false);  // Disable editing after save
        } catch (error) {
            setError('Failed to update profile.');
        }
    };

    // Navigate back to Dashboard
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <h1 className="title">Profile</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    {/* Displaying the current email address */}
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={auth.currentUser.email} // Display current email
                            disabled
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            disabled={!editing}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            disabled={!editing}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={userData.middleName}
                            onChange={handleChange}
                            disabled={!editing}
                        />
                    </div>

                    <div className="input-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            disabled={!editing}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={userData.dob}
                            onChange={handleChange}
                            disabled={!editing}
                            required
                        />
                    </div>

                    <div className="action-buttons">
                        {editing ? (
                            <>
                                <button type="submit" className="btn">Save</button>
                                <button type="button" onClick={() => setEditing(false)} className="btn cancel-btn">Cancel</button>
                            </>
                        ) : (
                            <button type="button" onClick={() => setEditing(true)} className="btn">Edit Profile</button>
                        )}
                    </div>
                </form>

                {/* Back to Dashboard Button */}
                <button onClick={handleBackToDashboard} className="btn back-btn">Back to Dashboard</button>
            </div>
        </div>
    );
};

export default Profile;
