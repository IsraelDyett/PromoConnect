import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import './NavigationHeader.css'; // Make sure to create this CSS file

const NavigationHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userType');
    // Redirect to login or home page
    navigate('/login');
  };

  const userId = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
    <div className="logo">
      <Link to="/">
        <img src="path/to/logo.png" alt="Logo" className="w-12 h-12" />
      </Link>
    </div>
    <nav className="nav-links flex space-x-4">
      <Link to="/dashboard" className="hover:text-gray-400">Home</Link>
      <Link to={`/profile/${userId}`} className="hover:text-gray-400">Profile</Link>
      {userId && token ? (
        <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
      ) : (
        <Link to="/login" className="hover:text-gray-400">Login</Link>
      )}
    </nav>
  </header>
);
};

export default NavigationHeader;
