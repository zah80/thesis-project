// src/components/Labors.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Labors.css'; // Ensure you have a CSS file for styling

const Labors = () => {
  const [laborers, setLaborers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLaborers();
  }, []);

  const fetchLaborers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/laborers/allLaborers'); // Update the URL as needed
      setLaborers(response.data.result);
    } catch (error) {
      console.error('Error fetching laborers:', error);
    }
  };

  const handleDelete = async (laborerID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this laborer?');
    if (confirmDelete) {
      try {
        await axios.delete('http://localhost:3000/api/laborers/removeWithoutAuth/4', { data: { laborerID } }); // Update the URL as needed
        fetchLaborers(); // Refresh the list after deletion
        setMessage('Laborer deleted successfully');
      } catch (error) {
        console.error('Error deleting laborer:', error);
        setMessage('Error deleting laborer');
      }
    }
  };

  return (
    <div className="laborers-container">
      <h2>Laborers</h2>
      {message && <p className="message">{message}</p>}
      <table className="laborers-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Phone</th>
            <th>Job ID</th>
            <th>Country ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {laborers.map((laborer) => (
            <tr key={laborer.laborerID}>
              <td>{laborer.fullName}</td>
              <td>{laborer.email}</td>
              <td>{laborer.experience}</td>
              <td>{laborer.phone}</td>
              <td>{laborer.jobID}</td>
              <td>{laborer.countryID}</td>
              <td>
                <button onClick={() => handleDelete(laborer.laborerID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Labors;
