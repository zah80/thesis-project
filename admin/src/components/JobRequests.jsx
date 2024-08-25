import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobRequests.css';

const JobRequests = () => {
  const [jobRequests, setJobRequests] = useState([]);
  const [message, setMessage] = useState('');
  const laborerID = 1; // Replace with the actual laborerID or fetch it dynamically

  useEffect(() => {
    fetchJobRequests();
  }, []);

  const fetchJobRequests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/job_requests`);
      setJobRequests(response.data);
    } catch (error) {
      console.error('Error fetching job requests:', error);
      setMessage('Error fetching job requests. Please make sure the backend server is running.');
    }
  };

  return (
    <div className="jobrequests-container">
 <h1 className="jobrequests-title">Job Requests</h1>      {message && <p className="message">{message}</p>}
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
          {jobRequests.length > 0 ? (
            jobRequests.map((request) => (
              <tr key={request.job_requestsID}>
                <td>{request.address}</td>
                <td>{request.description}</td>
                <td>{request.userID}</td>
                <td>{request.laborerID}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-data">No job requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobRequests;
