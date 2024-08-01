import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [emailUpdates, setEmailUpdates] = useState({
    product: true,
    security: false,
  });
  const [phoneUpdates, setPhoneUpdates] = useState({
    email: true,
    security: false,
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Handle save changes logic
    console.log('Save changes');
  };

  const handleUpdatePassword = () => {
    // Handle update password logic
    console.log('Update password');
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h2>Settings</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Search settings..."
        />
      </div>
      <div className="notifications">
        <h3>Notifications</h3>
        <div className="email-updates">
          <h4>Email</h4>
          <label>
            <input
              type="checkbox"
              checked={emailUpdates.product}
              onChange={(e) => setEmailUpdates({ ...emailUpdates, product: e.target.checked })}
            />
            Product updates
          </label>
          <label>
            <input
              type="checkbox"
              checked={emailUpdates.security}
              onChange={(e) => setEmailUpdates({ ...emailUpdates, security: e.target.checked })}
            />
            Security updates
          </label>
        </div>
        <div className="phone-updates">
          <h4>Phone</h4>
          <label>
            <input
              type="checkbox"
              checked={phoneUpdates.email}
              onChange={(e) => setPhoneUpdates({ ...phoneUpdates, email: e.target.checked })}
            />
            Email
          </label>
          <label>
            <input
              type="checkbox"
              checked={phoneUpdates.security}
              onChange={(e) => setPhoneUpdates({ ...phoneUpdates, security: e.target.checked })}
            />
            Security updates
          </label>
        </div>
        <button className="save-btn" onClick={handleSaveChanges}>Save changes</button>
      </div>
      <div className="password-update">
        <h3>Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
        <button className="update-btn" onClick={handleUpdatePassword}>Update</button>
      </div>
    </div>
  );
};

export default Settings;
