import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Labors.css';

const Labors = ({ refreshLaborers }) => {
  const [laborers, setLaborers] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddLaborerModal, setShowAddLaborerModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    experience: '',
    selectedCountry: '',
    selectedJob: '',
  });
  const [countries, setCountries] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchLaborers();
    fetchCountries();
    fetchJobs();
  }, [refreshLaborers]);

  const fetchLaborers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/laborers/allLaborers');
      setLaborers(response.data.result);
    } catch (error) {
      console.error('Error fetching laborers:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/countries');
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddLaborer = async () => {
    try {
      const { fullName, email, password, phone, experience, selectedCountry, selectedJob } = formData;
      if (!fullName || !email || !password || !phone || !experience || !selectedCountry || !selectedJob) {
        setMessage('Please fill in all fields');
        return;
      }

      const laborerData = {
        fullName,
        email,
        password,
        experience,
        phone,
        jobID: selectedJob,
        countryID: selectedCountry,
      };

      await axios.post('http://localhost:8080/api/laborers/create', laborerData);
      setShowAddLaborerModal(false);
      fetchLaborers(); // Refresh the laborers list
      setMessage('Laborer added successfully');

      // Show alert with email and password
      alert(`Laborer added successfully!\nEmail: ${email}\nPassword: ${password}`);
    } catch (error) {
      console.error('Error adding laborer:', error);
      setMessage('Error adding laborer');
    }
  };

  const handleDelete = async (laborerID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this laborer?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/laborers/removeWithoutAuth/${laborerID}`);
        fetchLaborers();
        setMessage('Laborer deleted successfully');
      } catch (error) {
        console.error('Error deleting laborer:', error);
        setMessage('Error deleting laborer');
      }
    }
  };

  return (
    <div className="labors-container">
      <h2 className="labors-title">Laborers</h2>
      {message && <p className="message">{message}</p>}
      <button onClick={() => setShowAddLaborerModal(true)} className="add-laborer-button">Add Laborer</button>
      <table className="labors-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Experience</th>
            <th>Phone</th>
            <th>Job ID</th>
            <th>Country ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {laborers.map((laborer) => (
            <tr key={laborer.laborerID}>
              <td>{laborer.fullName}</td>
              <td>{laborer.email}</td>
              <td>{laborer.experience}</td>
              <td>{laborer.phone}</td>
              <td>{laborer.jobID}</td>
              <td>{laborer.countryID}</td>
              <td>
                <button onClick={() => handleDelete(laborer.laborerID)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddLaborerModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Laborer</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Experience"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className="input-field"
            />
            <select
              value={formData.selectedCountry}
              onChange={(e) => handleInputChange('selectedCountry', e.target.value)}
              className="select-field"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.countryID} value={country.countryID}>
                  {country.countryName}
                </option>
              ))}
            </select>
            <select
              value={formData.selectedJob}
              onChange={(e) => handleInputChange('selectedJob', e.target.value)}
              className="select-field"
            >
              <option value="">Select Job</option>
              {jobs.map((job) => (
                <option key={job.jobID} value={job.jobID}>
                  {job.jobName}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleAddLaborer} className="submit-button">Submit</button>
              <button onClick={() => setShowAddLaborerModal(false)} className="close-button">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Labors;
