// src/components/JobRequests.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobRequests.css'; // Ensure you have a CSS file for styling

const JobRequests = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [message, setMessage] = useState('');
  const laborerID = 1; // Replace with the actual laborerID or fetch it dynamically

  useEffect(() => {
    fetchJobRequests();
  }, []);

  const fetchJobRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/job_requests/`); // Update the URL as needed
      setJobRequests(response.data);
    } catch (error) {
      console.error('Error fetching job requests:', error);
      setMessage('Error fetching job requests');
    }
  };

  return (
    <div className="jobrequests-container">
      <h2>Job Requests</h2>
      {message && <p className="message">{message}</p>}
      <table className="jobrequests-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Description</th>
            <th>User ID</th>
            <th>Laborer ID</th>
          </tr>
        </thead>
        <tbody>
          {jobRequests.map((request) => (
            <tr key={request.job_requestsID}>
              <td>{request.address}</td>
              <td>{request.description}</td>
              <td>{request.userID}</td>
              <td>{request.laborerID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobRequests;
