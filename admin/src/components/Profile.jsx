import React, { useState } from 'react';
import './Profile.css';
import avatarImage from '../assets/MED.jpg'; // Import the image from the assets folder

const Profile = () => {
  const [user, setUser] = useState({
    firstName: 'Mohamed',
    lastName: 'Zahrouni',
    email: 'Med.zahrouni@khademni.de',
    phone: 'Phone number',
    state: 'State',
    city: 'City',
    avatar: avatarImage, // Set the initial avatar to the imported image
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSaveDetails = () => {
    // Handle save details logic
    console.log('Save details');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser({
          ...user,
          avatar: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <h2>Account</h2>
      <div className="profile-card">
        <img src={user.avatar} alt="Avatar" className="avatar" />
        <h3>{user.firstName} {user.lastName}</h3>
        <p>{user.city}, {user.state} USA</p>
        <p>GTM-7</p>
        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          style={{ display: 'none' }}
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-upload" className="upload-btn">Upload picture</label>
      </div>
      <div className="profile-info">
        <h3>Profile</h3>
        <p>The information can be edited</p>
        <div className="profile-form">
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleInputChange}
            placeholder="First name"
          />
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleInputChange}
            placeholder="Last name"
          />
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            placeholder="Email address"
          />
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            placeholder="Phone number"
          />
          <input
            type="text"
            name="state"
            value={user.state}
            onChange={handleInputChange}
            placeholder="State"
          />
          <input
            type="text"
            name="city"
            value={user.city}
            onChange={handleInputChange}
            placeholder="City"
          />
          <button className="save-btn" onClick={handleSaveDetails}>Save details</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
