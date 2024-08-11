import React, { useState } from 'react';
import axios from 'axios';
import './Profile.css';
import avatarImage from '../assets/MED.jpg'; // Import the image from the assets folder

const Profile = () => {
  const [user, setUser] = useState({
    firstName: 'Mohamed',
    lastName: 'Zahrouni',
    email: 'Med.zahrouni@khademni.de',
    phone: '',
    state: '',
    city: '',
    avatar: avatarImage, // Set the initial avatar to the imported image
  });
  const [isSaving, setIsSaving] = useState(false); // To handle saving state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
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

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const response = await axios.post('/api/admin/save', user); // Replace with your API endpoint
      if (response.status === 200) {
        console.log('Admin details saved successfully:', response.data);
        // Optionally, you can display a success message or update UI here
      }
    } catch (error) {
      console.error('Error saving admin details:', error);
      // Optionally, display an error message or handle error here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Account</h2>
      <div className="profile-card">
        <img src={user.avatar} alt="Avatar" className="avatar" />
        <h3>{user.firstName} {user.lastName}</h3>
        <p>{user.city}, {user.state}</p>
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
          <button
            className="save-btn"
            onClick={handleSaveDetails}
            disabled={isSaving} // Disable button while saving
          >
            {isSaving ? 'Saving...' : 'Save details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
