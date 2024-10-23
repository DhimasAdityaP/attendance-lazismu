// src/components/Login.js
import React, { useState, useContext } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import the Supabase client
import './Login.css'; // Import the CSS file

const Login = () => {
  const { setIsAuthenticated, setUserRole } = useContext(AttendanceContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Fetch user data from the Supabase database
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        setErrorMessage('User does not exist');
        return;
      }

      // Validate password (In production, this would be a hashed password)
      if (user.password === password) {
        setIsAuthenticated(true);
        setUserRole(user.role); // Set role based on user data
        alert(`Logged in as: ${username}`);

        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/adminpanel'); // Admin to Admin Panel
        } else {
          navigate('/attendance'); // Employee to Take Attendance
        }
      } else {
        setErrorMessage('Incorrect password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('An error occurred. Please try again later.');
    }

    // Reset form fields
    setUsername('');
    setPassword('');
  };

  return (
    <div className="container">
      <h2 className="header">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="input"
          />
        </div>
        <div className="form-group">
          <label className="label">Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="input"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="button">Login</button>
      </form>
    </div>
  );
};

export default Login;
