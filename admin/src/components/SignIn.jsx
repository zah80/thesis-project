import React, { useState } from 'react';
import './SignIn.css';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

const SignIn = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      console.log('Sign In successful');
      setCurrentPage('Overview'); // Navigate to another page after successful sign-in
    } else {
      if (!storedUser) {
        setErrorMessage('No account found with this email.');
      } else if (storedUser.email !== email) {
        setErrorMessage('Invalid email.');
      } else if (storedUser.password !== password) {
        setErrorMessage('Invalid password.');
      }
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign in</h2>
      <p>Don't have an account? <a href="#signup" onClick={() => setCurrentPage('SignUp')}>Sign up</a></p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="signin-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="signin-input"
      />
      <a href="#forgot-password" className="forgot-password">Forgot password?</a>
      <button onClick={handleSignIn} className="signin-btn">Sign in</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      
      {/* New Feature: Display example email and password */}
      <Alert severity="warning" className="signin-info">
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          med.zahrouni@khadamni.tn
        </Typography>{' '}
        with password{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          Med123
        </Typography>
      </Alert>
    </div>
  );
};

export default SignIn;
