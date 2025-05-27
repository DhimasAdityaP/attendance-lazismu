// src/components/Login.js
import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast'; // ✅ Import di bagian atas
import { AttendanceContext } from '../AttendanceContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import './Login.css';

const Login = () => {
  const { setIsAuthenticated, setUserRole } = useContext(AttendanceContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        setErrorMessage('User does not exist');
        return;
      }

      if (user.password === password) {
  setIsAuthenticated(true);
  setUserRole(user.role);
  
  toast.success(`Login sebagai ${user.role === 'admin' ? 'Admin' : 'User'}`, {
    duration: 3000,
  });

  navigate(user.role === 'admin' ? '/adminpanel' : '/attendance');
} else {
  setErrorMessage('Incorrect password');
}

    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('An error occurred. Please try again later.');
    }

    setUsername('');
    setPassword('');
  };

  return (
    <motion.div 
      className="login-container"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="login-header"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Selamat Datang 👋
      </motion.h2>

      <form onSubmit={handleSubmit} className="login-form">
        <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
          <label className="label">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="input"
          />
        </motion.div>

        <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
          <label className="label">Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="input"
          />
        </motion.div>

        {errorMessage && (
          <motion.p 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMessage}
          </motion.p>
        )}

        <motion.button 
          type="submit" 
          className="login-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;
