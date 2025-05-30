// src/components/TakeAttendance.js
import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../AttendanceContext';
import { supabase } from '../supabaseClient';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './TakeAttendance.css';
import 'leaflet/dist/leaflet.css';

// Fix icon issue in Leaflet when used in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TakeAttendance = () => {
  const { attendanceRecords, setAttendanceRecords } = useContext(AttendanceContext);
  const [date, setDate] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [location, setLocation] = useState('Fetching location...');
  const [latLng, setLatLng] = useState(null); // Store lat/lng for the map
  const [status, setStatus] = useState('present');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locString = `Latitude: ${latitude}, Longitude: ${longitude}`;
          setLocation(locString);
          setLatLng([latitude, longitude]);
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
      const { error } = await supabase
        .from('attendance')
        .insert([newRecord]);

      if (error) {
        setErrorMessage('Failed to submit attendance: ' + error.message);
      } else {
        setAttendanceRecords([...attendanceRecords, newRecord]);
        setSuccessMessage('Attendance submitted successfully!');
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
      <h2>Ambil Kehadiran</h2>
      <form onSubmit={handleSubmit} className="attendance-form">
        <div className="form-group">
          <label>Tanggal:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Nama Karyawan:</label>
          <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required className="form-control" />
        </div>
        <div className="form-group">
          <label>Lokasi Terkini:</label>
          <input type="text" value={location} readOnly className="form-control" />
          {latLng && (
            <MapContainer center={latLng} zoom={15} style={{ height: '300px', marginTop: '10px' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={latLng}>
                <Popup>Lokasi Anda</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>
        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
            <option value="present">Hadir</option>
            <option value="permission">Izin</option>
            <option value="absent">Tidak Hadir</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">Kirim Kehadiran</button>
        {successMessage && <p className="message success">{successMessage}</p>}
        {errorMessage && <p className="message error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default TakeAttendance;
