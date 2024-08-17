import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Ratings.css'; // Ensure you have a CSS file for styling

const Ratings = () => {
  const [ratings, setRatings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rating/'); // Update the URL as needed
      setRatings(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setMessage('Error fetching ratings');
    }
  };

  return (
    <div className="ratings-container">
      <h2 className="ratings-title">Ratings</h2>
      {message && <p className="message">{message}</p>}
      <table className="ratings-table">
        <thead>
          <tr>
            <th>Comment</th>
            <th>Rate</th>
            <th>User Full Name</th>
            <th>Laborer Full Name</th>
          </tr>
        </thead>
        <tbody>
          {ratings.map((rating, index) => (
            <tr key={index}>
              <td>{rating.comment}</td>
              <td>{rating.rate}</td>
              <td>{rating.userName}</td>
              <td>{rating.laborerName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ratings;
