// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AttendanceContext } from '../AttendanceContext';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, userRole } = useContext(AttendanceContext);
  const navigate = useNavigate(); // ✅ gunakan navigate

  const handleLogout = () => {
    setIsAuthenticated(false);     // Reset auth state
    navigate('/');                 // Redirect ke halaman awal
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
