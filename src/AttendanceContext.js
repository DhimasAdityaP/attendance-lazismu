// src/AttendanceContext.js
import React, { createContext, useState } from 'react';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(''); // Menyimpan role pengguna

  return (
    <AttendanceContext.Provider value={{ attendanceRecords, setAttendanceRecords, isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      {children}
    </AttendanceContext.Provider>
  );
};
