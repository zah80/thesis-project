import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setCurrentPage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Admin-Dashboard</h3>
      </div>
      <div className="sidebar-menu">
          <ul>
          <li><button onClick={() => setCurrentPage('Overview')}>Overview</button></li>
          <li><button onClick={() => setCurrentPage('Users')}>Users</button></li>
          <li><button onClick={() => setCurrentPage('Labors')}>Labors</button></li>
          <li><button onClick={() => setCurrentPage('JobRequests')}>Job Requests</button></li>
          <li><button onClick={() => setCurrentPage('Ratings')}>Ratings</button></li>
          <li><button onClick={() => setCurrentPage('UserLaborAppointments')}>User Labor Appointments</button></li>
          <li><button onClick={() => setCurrentPage('Settings')}>Settings</button></li>
          <li><button onClick={() => setCurrentPage('Account')}>Account</button></li>
          <li><button onClick={() => setCurrentPage('Error')}>Error</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
