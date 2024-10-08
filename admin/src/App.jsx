import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Users from './components/Users';
import Labors from './components/Labors';
import JobRequests from './components/JobRequests';
import Ratings from './components/Ratings';
import UserLaborAppointments from './components/UserLaborAppointments';
import Profile from './components/Profile';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import OverView from './components/OverView'; // Ensure the import is spelled correctly
import NotFound from './components/NotFound';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('Overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'Users':
        return <Users />;
      case 'Labors':
        return <Labors />;
      case 'JobRequests':
        return <JobRequests />;
      case 'Ratings':
        return <Ratings />;
      case 'UserLaborAppointments':
        return <UserLaborAppointments />;
      case 'Profile':
        return <Profile />;
      case 'Settings':
        return <Settings />;
      case 'SignIn':
        return <SignIn setCurrentPage={setCurrentPage} />;
      case 'SignUp':
        return <SignUp setCurrentPage={setCurrentPage} />;
      case 'AddLaborer':
        return <SignUp setCurrentPage={setCurrentPage} isLaborerSignUp={true} />; // Updated case for AddLaborer
      case 'Account':
        return <Profile />;
      case 'SignOut':
        return <div><h2>Sign Out</h2></div>;
      case 'Error':
        return <NotFound setCurrentPage={setCurrentPage} />;
      default:
        return <OverView />;
    }
  };

  return (
    <div className="app">
      <Sidebar setCurrentPage={setCurrentPage} />
      <div className="main-section">
        <Header setCurrentPage={setCurrentPage} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;
