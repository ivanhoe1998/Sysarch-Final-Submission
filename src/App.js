import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import RegistrationPage from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Inventory from './components/Inventory';
import Market from './components/Market'; // Import the Market component
import buddybakingdskwall from './buddybakingdskwall.png';
import { auth } from './firebase';

// Protect routes by checking if the user is authenticated
const ProtectedRoute = ({ element }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            setLoading(false); // Allow rendering if user is authenticated
        }
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>; // Show loading while checking authentication
    }

    return element; // Return the protected element if authenticated
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Home Route */}
                <Route 
                    path="/" 
                    element={
                        <div 
                            className="app-container" 
                            style={{ 
                                backgroundImage: `url(${buddybakingdskwall})`,
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100vh', 
                                textAlign: 'center' 
                            }}
                        >
                            <h1 className="title" style={{ marginBottom: '20px' }}>Baking Buddy</h1>
                            <div 
                                className="button-container" 
                                style={{
                                    display: 'flex',
                                    gap: '20px',
                                    justifyContent: 'center',
                                    marginTop: '10px'
                                }}
                            >
                                <Link to="/register" className="button" style={buttonStyle}>Register Account</Link>
                                <Link to="/login" className="button" style={buttonStyle}>Login Account</Link>
                            </div>
                        </div>
                    }
                />
                
                {/* Registration Route */}
                <Route path="/register" element={<RegistrationPage />} />

                {/* Login Route */}
                <Route path="/login" element={<Login />} />

                {/* Dashboard Route */}
                <Route 
                    path="/dashboard" 
                    element={<ProtectedRoute element={<Dashboard />} />}
                />

                {/* Profile Route (Protected) */}
                <Route 
                    path="/profile" 
                    element={<ProtectedRoute element={<Profile />} />}
                />

                {/* Inventory Route (Protected) */}
                <Route 
                    path="/inventory/:userId" 
                    element={<ProtectedRoute element={<Inventory />} />}
                />

                {/* Market Route (Protected) */}
                <Route 
                    path="/market" 
                    element={<ProtectedRoute element={<Market />} />}
                />
            </Routes>
        </Router>
    );
}

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4E2A1C',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    display: 'inline-block',
    textAlign: 'center',
    transition: 'background-color 0.3s',
};

export default App;
