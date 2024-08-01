import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserLaborAppointments.css'; // Import your CSS file for styling

const UserLaborAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/userLaborerAppointments/'); // Adjust the endpoint as needed
        setAppointments(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="user-labor-appointments">
      <h2>User Labor Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>User ID</th>
            <th>Laborer ID</th>
            <th>Price</th>
            <th>Is Finished</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.UserLaborerAppointmentsID}>
              <td>{appointment.UserLaborerAppointmentsID}</td>
              <td>{appointment.userID}</td>
              <td>{appointment.laborerID}</td>
              <td>{appointment.price}</td>
              <td>{appointment.isFinish ? 'Yes' : 'No'}</td>
              <td>{appointment.timeStart}</td>
              <td>{appointment.timeFinish}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserLaborAppointments;
