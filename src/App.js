// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TakeAttendance from './components/TakeAttendance';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import Login from './components/Login';
import { AttendanceProvider } from './AttendanceContext';
import './App.css'; // Add this line if you want to style your components
import welcomeImage from './welcome.png'; // Adjust path as necessary


const App = () => {
  // Function to get greeting based on current time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) {
      return "Good Morning!";
    } else if (hours < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  return (
    <AttendanceProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="welcome-container">
                <img src={welcomeImage} alt="Welcome" className="welcome-image" />
                <h1>{getGreeting()} Salam Sejahtera bagi kita keluarga KL LAZISMU BANTUL</h1>
              </div>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/attendance" element={<TakeAttendance />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  );
};

export default App;
