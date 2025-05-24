// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AttendanceContext } from '../AttendanceContext';
import './Navbar.css'; // Import the CSS file
import logo from '../assets/logo.png'; // Import logo image

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, userRole } = useContext(AttendanceContext);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="KL LAZISMU BANTUL" className="logo-image" />
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        {!isAuthenticated ? (
          <Link to="/login" className="nav-link">Login</Link>
        ) : (
          <>
            {userRole === 'karyawan' && (
              <Link to="/attendance" className="nav-link">Mengambil Kehadiran</Link>
            )}
            {userRole === 'admin' && (
              <Link to="/admin" className="nav-link">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
