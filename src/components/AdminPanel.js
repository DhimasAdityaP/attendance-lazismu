import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import { supabase } from '../supabaseClient'; // Import the Supabase client
import * as XLSX from 'xlsx'; // Import XLSX for exporting to Excel

const AdminPanel = () => {
  const { attendanceRecords, setAttendanceRecords } = useContext(AttendanceContext);
  const [editIndex, setEditIndex] = useState(null);
  const [newRecord, setNewRecord] = useState({
    date: '',
    employee_name: '',
    location: '', // Location will be set dynamically
    status: 'present',
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Load attendance records from Supabase on component mount
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const { data, error } = await supabase
        .from('attendance') // Supabase table name
        .select('*');

      if (error) {
        console.error('Error fetching attendance records:', error);
        setErrorMessage('Error fetching data.');
      } else {
        setAttendanceRecords(data); // Set attendance data from the database
      }
    };

    fetchAttendanceRecords();
  }, [setAttendanceRecords]);

  // Function to delete an attendance record
  const handleDelete = async (index, id) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id); // Assuming 'id' is the unique identifier

      if (error) {
        setErrorMessage('Error deleting record.');
        return;
      }

      const updatedRecords = attendanceRecords.filter((_, i) => i !== index);
      setAttendanceRecords(updatedRecords);
    } catch (err) {
      console.error('Error deleting record:', err);
      setErrorMessage('Error deleting record.');
    }
  };

  // Function to prepare the record for editing
  const handleEdit = (index) => {
    setEditIndex(index);
    setNewRecord({
      date: attendanceRecords[index].date,
      employee_name: attendanceRecords[index].employee_name,
      location: attendanceRecords[index].location,
      status: attendanceRecords[index].status,
    });
  };

  // Function to save the edited attendance record
  const handleSave = async (index, id) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .update({
          date: newRecord.date,
          employee_name: newRecord.employee_name,
          location: newRecord.location,
          status: newRecord.status,
        })
        .eq('id', id);

      if (error) {
        setErrorMessage('Error saving record.');
        return;
      }

      const updatedRecords = attendanceRecords.map((record, i) =>
        i === index ? newRecord : record
      );

      setAttendanceRecords(updatedRecords);
      setEditIndex(null);
    } catch (err) {
      console.error('Error saving record:', err);
      setErrorMessage('Error saving record.');
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // Function to export attendance records to CSV
  const exportToCSV = () => {
    const csvData = attendanceRecords.map(record => ({
      Date: record.date,
      'Employee Name': record.employee_name,
      Location: record.location,
      Status: record.status,
    }));

    const csvContent = [
      ["Date", "Employee Name", "Location", "Status"],
      ...csvData.map(row => Object.values(row)),
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "attendance_records.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export attendance records to XLSX
  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Records");
    XLSX.writeFile(workbook, "attendance_records.xlsx");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Panel - Rekap Kehadiran</h2>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Button to export attendance records */}
      <button onClick={exportToCSV} style={styles.button}>Ekspor ke CSV</button>
      <button onClick={exportToXLSX} style={styles.button}>Ekspor ke XLSX</button>

      {/* List of attendance entries */}
      <ul style={styles.recordList}>
        {attendanceRecords.length === 0 ? (
          <li style={styles.recordItem}>Rekap Kehadiran Tidak Ada</li>
        ) : (
          attendanceRecords.map((record, index) => (
            <li key={index} style={styles.recordItem}>
              <strong>Tanggal:</strong> {record.date} <br />
              <strong>Nama:</strong> {record.employee_name} <br />
              <strong>Lokasi Terkini:</strong> {record.location} <br />
              <strong>Status:</strong> {record.status} <br />
              <button onClick={() => handleEdit(index)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(index, record.id)} style={styles.deleteButton}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

// Styles
const styles = {
  container: {
    margin: '20px auto',
    padding: '20px',
    maxWidth: '800px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  recordList: {
    listStyleType: 'none',
    padding: 0,
  },
  recordItem: {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#eef',
    borderRadius: '4px',
  },
  editButton: {
    marginRight: '5px',
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  button: {
    margin: '10px 5px',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default AdminPanel;
