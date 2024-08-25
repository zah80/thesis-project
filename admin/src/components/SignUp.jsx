import React, { useState } from 'react';
import './SignUp.css';

const SignUp = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email === formData.email) {
      setErrorMessage('This email is already used');
    } else {
      localStorage.setItem('user', JSON.stringify(formData));
      console.log('User signed up successfully');
      setCurrentPage('SignIn'); // Navigate to the sign-in page after successful sign-up
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Laborer Sign up</h2>
      <p>Already have an account? <a href="#signin" onClick={() => setCurrentPage('SignIn')}>Sign in</a></p>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="First name"
        className="signup-input"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Last name"
        className="signup-input"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email address"
        className="signup-input"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="Password"
        className="signup-input"
      />
      <label>
        <input type="checkbox" className="signup-checkbox" />
        I have read the <a href="#terms">terms and conditions</a>
      </label>
      <button onClick={handleSignUp} className="signup-btn">Sign up</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
    </div>
  );
};

export default SignUp;
