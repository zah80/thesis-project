import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from 'react-native'; 
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import { MyContext } from '../context/ContextProvider';

const WorkerSignUp = ({ navigation })  =>{
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    selectedCountry: null,
    selectedJob: null,
    experience: '',
  });
  const {url}=useContext(MyContext);
  const [countries, setCountries] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://192.168.1.157:3000/api/countries');
      setCountries(response.data); 
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchCountryById = async (countryID) => {
    try {
      const response = await axios.get(url+`/api/countries/${countryID}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching country by ID:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://192.168.1.157:3000/api/jobs');
      setJobs(response.data); 
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
    fetchJobs();
  }, []);

  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      selectedCountry: null,
      selectedJob: null,
    }));
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCheckboxPress = () => {
    setIsChecked(prevState => !prevState);
  };

  const handleSignUp = async () => {
    try {
      const { fullName, email, password, phone, selectedCountry, selectedJob, experience } = formData;
      if (!fullName || !email || !password || !phone || !selectedCountry || !selectedJob || !experience || !isChecked) {
        Alert.alert('Sign Up Failed', 'Please fill in all fields and agree to the terms.');
        return;
      }
      const response = await axios.post(url+'/api/laborers/create', {
        fullName,
        email,
        password,
        phone,
        countryID: selectedCountry,
        jobID: selectedJob,
        experience,
      });
      console.log('Sign up response:', response);
      console.log('Sign up response data:', response.data);
      if (response.data) {
        Alert.alert('Sign Up Successful', 'Welcome!');
        navigation.navigate('WorkerSignIn'); 
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error.response) {
        Alert.alert('Sign Up Failed', `Error: ${error.response.data.message || 'Please try again.'}`);
      } else {
        Alert.alert('Sign Up Failed', 'Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="user" size={50} color="#fff" />
      </View>

      <Text style={styles.headerText}>Hello User!</Text>
      <Text style={styles.subHeaderText}>Create your account for a better experience</Text>

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowPassword(prevState => !prevState)}
        >
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#666"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="briefcase" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Experience"
          placeholderTextColor="#666"
          value={formData.experience}
          onChangeText={(text) => handleInputChange('experience', text)}
        />
      </View>

      <TouchableOpacity
        style={styles.pickerContainer} 
        onPress={() => {
          fetchCountries(); 
          setShowCountryModal(true);
        }}
      >
        <Text style={styles.countryText}>
          {formData.selectedCountry 
            ? countries.find(country => country.countryID === formData.selectedCountry)?.countryName 
            : 'Select Country'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pickerContainer} 
        onPress={() => {
          fetchJobs(); 
          setShowJobModal(true);
        }}
      >
        <Text style={styles.countryText}>
          {formData.selectedJob 
            ? jobs.find(job => job.jobID === formData.selectedJob)?.jobName 
            : 'Select Job'}
        </Text>
      </TouchableOpacity>

      

      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={[styles.checkbox, isChecked && styles.checkedCheckbox]} 
          onPress={handleCheckboxPress}
        >
          {isChecked && (
            <MaterialIcons name="check" size={16} color="#fff" style={styles.checkmark} />
          )}
        </TouchableOpacity>
        <Text style={styles.agreeText}>
          I agree to <Text style={styles.linkText}>the Terms of Service</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already have an account? <Text style={styles.signInLink} onPress={() => navigation.navigate('WorkerSignIn')}>Sign In</Text>
      </Text>

      <Modal visible={showCountryModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={formData.selectedCountry}
              onValueChange={(itemValue) => {
                handleInputChange('selectedCountry', itemValue);
                setShowCountryModal(false);
              }}
            >
              {countries.length > 0 ? (
                countries.map((country) => (
                  <Picker.Item key={country.countryID} label={country.countryName} value={country.countryID} />
                ))
              ) : (
                <Picker.Item label="No countries available" value="" />
              )}
            </Picker>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowCountryModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showJobModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerModal}>
            <Picker
              selectedValue={formData.selectedJob}
              onValueChange={(itemValue) => {
                handleInputChange('selectedJob', itemValue);
                setShowJobModal(false);
              }}
            >
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <Picker.Item key={job.jobID} label={job.jobName} value={job.jobID} />
                ))
              ) : (
                <Picker.Item label="No jobs available" value="" />
              )}
            </Picker>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowJobModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#555',
    borderRadius: 30,
    paddingHorizontal: 20,
    width: '100%',
    height: 50,
    marginBottom: 15,
    justifyContent: 'center', // Center align picker text
  },
  countryText: {
    color: '#fff',
    textAlign: 'center', // Center align picker text
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: 'pink',
    borderColor: 'pink',
  },
  checkmark: {
    width: 16,
    height: 16,
    color: '#fff',
  },
  agreeText: {
    color: '#fff',
  },
  linkText: {
    color: 'pink',
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signInText: {
    color: '#fff',
  },
  signInLink: {
    color: 'pink',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerModal: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'pink',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  iconButton: {
    position: 'absolute',
    right: 20,
  },
});

export default WorkerSignUp;
