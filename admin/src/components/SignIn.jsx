import React, { useState } from 'react';
import './SignIn.css';

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
      <h2>Sign in</h2>
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
      <div className="signin-info">
        <p>Use <strong>Med.zahrouni@khademni.de</strong> with password <strong>med123</strong></p>
      </div>
    </div>
  );
};

export default SignIn;
