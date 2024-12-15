import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // Importing auth from firebase

const Dashboard = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;  // Get current user

    // Handle Profile click event
    const handleProfileClick = (event) => {
        event.stopPropagation(); 
        console.log("Profile clicked!"); 
        navigate('/profile'); 
    };

    // Handle Market click event
    const handleMarketClick = (event) => {
        event.stopPropagation(); 
        console.log("Market clicked!"); 
        navigate('/market'); 
    };

    // Handle Inventory click event
    const handleInventoryClick = (event) => {
        event.stopPropagation(); 
        console.log("Inventory clicked!"); 

        if (user) {
            navigate(`/inventory/${user.uid}`);  // Pass userId dynamically
        } else {
            console.log('User not authenticated!');
            navigate('/login');  // Redirect to login if no user
        }
    };

    // Handle Logout click event
    const handleLogout = (event) => {
        event.stopPropagation(); 
        alert('You have logged out.'); 
        navigate('/login'); 
    };

    return (
        <div className="dashboard-container">
            <div className="app-bar">
                <h1 className="app-bar-title">Welcome to the Dashboard</h1>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-item" onClick={handleProfileClick}>
                    <img src="/icons/profile.png" alt="Profile" className="icon" />
                    <span className="item-title">Profile</span>
                </div>
                <div className="dashboard-item" onClick={handleInventoryClick}>
                    <img src="/icons/inventory.png" alt="Inventory" className="icon" />
                    <span className="item-title">Inventory</span>
                </div>
                <div className="dashboard-item" onClick={handleMarketClick}>
                    <img src="/icons/market.png" alt="Market" className="icon" />
                    <span className="item-title">Market</span>
                </div>
                <div className="dashboard-item" onClick={handleLogout}>
                    <img src="/icons/logout.png" alt="Logout" className="icon" />
                    <span className="item-title">Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
