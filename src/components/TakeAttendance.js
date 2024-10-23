// src/components/TakeAttendance.js
import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import { supabase } from '../supabaseClient'; // Import the Supabase client
import './TakeAttendance.css'; // Import custom CSS for styling

const TakeAttendance = () => {
  const { attendanceRecords, setAttendanceRecords } = useContext(AttendanceContext);
  const [date, setDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [status, setStatus] = useState('present');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Mendapatkan lokasi saat ini menggunakan Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error('Error getting location: ', error);
          setLocation('Unable to retrieve location');
        }
      );
    } else {
      setLocation('Geolocation is not supported by this browser');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newRecord = {
      date,
      employee_name: employeeName,
      location,
      status,
    };

    try {
      // Insert new attendance record into the Supabase database
      const { error } = await supabase
        .from('attendance')
        .insert([newRecord]);

      if (error) {
        setErrorMessage('Failed to submit attendance: ' + error.message);
      } else {
        setAttendanceRecords([...attendanceRecords, newRecord]); // Update the context state
        setSuccessMessage('Attendance submitted successfully!');

        // Reset form fields
        setDate('');
        setEmployeeName('');
        setStatus('present');
      }
    } catch (err) {
      console.error('Error submitting attendance:', err);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="attendance-form-container">
      <h2>Take Attendance</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Employee Name:</label>
          <input 
            type="text" 
            value={employeeName} 
            onChange={(e) => setEmployeeName(e.target.value)} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input 
            type="text" 
            value={location} 
            readOnly // Lokasi diperoleh otomatis
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
            <option value="present">Present</option>
            <option value="permission">Permission</option>
            <option value="absent">Absent</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">Submit Attendance</button>
        {successMessage && <p className="message success">{successMessage}</p>}
        {errorMessage && <p className="message error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default TakeAttendance;
