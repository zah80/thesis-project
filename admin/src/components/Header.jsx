import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import ProfileImage from '../assets/MED.jpg'; // Import your image

const Header = ({ setCurrentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="icons">
          <FontAwesomeIcon icon={faUsers} className="header-icon" onClick={() => setCurrentPage('SignIn')} />
        </div>
        <div className="profile-menu" onClick={handleMenuToggle}>
          <img
            src={ProfileImage}
            alt="Profile Avatar"
            className="profile-avatar"
          />
          <span>Mohamed Zahrouni</span>
          {menuOpen && (
            <ul className="dropdown-menu">
              <li><button onClick={() => setCurrentPage('Settings')}>Settings</button></li>
              <li><button onClick={() => setCurrentPage('Profile')}>Profile</button></li>
              <li><button onClick={() => setCurrentPage('SignOut')}>Sign out</button></li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
