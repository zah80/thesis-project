// src/components/Users.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css'; // Ensure you have a CSS file for styling

const Users = () => {
  const [users, setUsers] = useState([]);



  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users`); // Update the URL as needed
      setUsers(response.data.users);
      console.log("users",response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userID) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/deleteWithoutAuth/${userID}`); // Update the URL as needed
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2>Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Address</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userID}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>{user.addresse}</td>
              <td>{user.countryID}</td>
              <td>
                <button onClick={() => handleDelete(user.userID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
