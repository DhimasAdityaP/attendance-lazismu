import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';

const AdminPanel = () => {
  const { attendanceRecords, setAttendanceRecords } = useContext(AttendanceContext);
  const [editIndex, setEditIndex] = useState(null);
  const [newRecord, setNewRecord] = useState({
    date: '',
    employee_name: '',
    location: '',
    status: 'present',
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*');

      if (error) {
        console.error('Error fetching attendance records:', error);
        setErrorMessage('Error fetching data.');
      } else {
        setAttendanceRecords(data);
      }
    };
    fetchAttendanceRecords();
  }, [setAttendanceRecords]);

  const handleDelete = async (index, id) => {
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);

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

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewRecord({
      date: attendanceRecords[index].date,
      employee_name: attendanceRecords[index].employee_name,
      location: attendanceRecords[index].location,
      status: attendanceRecords[index].status,
    });
  };

  const handleSave = async () => {
    try {
      if (editIndex !== null) {
        const { error } = await supabase
          .from('attendance')
          .update(newRecord)
          .eq('id', attendanceRecords[editIndex].id);

        if (error) {
          setErrorMessage('Error saving record.');
          return;
        }

        const updatedRecords = attendanceRecords.map((record, i) =>
          i === editIndex ? newRecord : record
        );
        setAttendanceRecords(updatedRecords);
        setEditIndex(null);
      } else {
        const { data, error } = await supabase
          .from('attendance')
          .insert(newRecord)
          .single();

        if (error) {
          setErrorMessage('Error creating record.');
          return;
        }
        setAttendanceRecords([...attendanceRecords, data]);
      }
      setNewRecord({ date: '', employee_name: '', location: '', status: 'present' });
    } catch (err) {
      console.error('Error saving record:', err);
      setErrorMessage('Error saving record.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

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

  const exportToXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Records");
    XLSX.writeFile(workbook, "attendance_records.xlsx");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Admin Panel - Attendance Records</h2>
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}

      <div style={styles.formContainer}>
        <h3>{editIndex !== null ? 'Edit Attendance' : 'Add New Attendance'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={styles.form}>
          <input
            type="date"
            name="date"
            value={newRecord.date}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="employee_name"
            placeholder="Employee Name"
            value={newRecord.employee_name}
            onChange={handleInputChange}
            style={styles.input}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={newRecord.location}
            onChange={handleInputChange}
            style={styles.input}
          />
          <select
            name="status"
            value={newRecord.status}
            onChange={handleInputChange}
            style={styles.select}
            required
          >
            <option value="present">Present</option>
            <option value="permission">Permission</option>
            <option value="absent">Absent</option>
          </select>
          <button type="submit" style={styles.saveButton}>
            {editIndex !== null ? 'Update Record' : 'Save Record'}
          </button>
        </form>
      </div>

      <div style={styles.exportButtons}>
        <button onClick={exportToCSV} style={styles.button}>Export to CSV</button>
        <button onClick={exportToXLSX} style={styles.button}>Export to XLSX</button>
      </div>

      <div style={styles.cardGrid}>
        {attendanceRecords.slice(0, 6).map((record, index) => (
          <div key={record.id} style={styles.card}>
            <p><strong>Date:</strong> {record.date}</p>
            <p><strong>Name:</strong> {record.employee_name}</p>
            <p><strong>Location:</strong> {record.location}</p>
            <p><strong>Status:</strong> {record.status}</p>
            <div style={styles.cardButtons}>
              <button onClick={() => handleEdit(index)} style={styles.editButton}>Edit</button>
              <button onClick={() => handleDelete(index, record.id)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
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
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    fontSize: '1.8rem',
    marginBottom: '20px',
  },
  formContainer: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    marginBottom: '10px',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  saveButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  exportButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '15px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  cardButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: '#000',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '15px',
  },
};
export default AdminPanel;
