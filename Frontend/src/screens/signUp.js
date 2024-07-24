import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput } from 'react-native'; 
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    selectedCountry: null,
  });
  const [countries, setCountries] = useState([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://192.168.100.29:3000/api/countries');
      setCountries(response.data); 
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchCountryById = async (countryID) => {
    try {
      const response = await axios.get(`http://192.168.100.16:3000/api/countries/${countryID}`);
      return response.data; 
    } catch (error) {
      console.error('Error fetching country by ID:', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);


  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      selectedCountry: null 
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
      const { fullName, email, password, phone, selectedCountry } = formData;
        if (!fullName || !email || !password || !phone || !selectedCountry || !isChecked) {
        Alert.alert('Sign Up Failed', 'Please fill in all fields and agree to the terms.');
        return;
      }
      const response = await axios.post('http://192.168.100.29:3000/api/users/register', {
        fullName,
        email,
        password,
        phone,
        countryID: selectedCountry,
      });
        console.log('Sign up response:', response);
      if (response.data.success) {
        Alert.alert('Sign Up Successful', 'Welcome!');
        navigation.navigate('SignIn'); 
      } else {
        Alert.alert('Sign Up Failed', response.data.message || 'Please try again.');
      }
    } catch (error) {
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

      <TouchableOpacity
        style={styles.pickerContainer} // Use new style for picker
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
        Already have an account? <Text style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>Sign In</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(50, 0, 150)',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'pink',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    marginLeft: 10,
    color: 'black',
  },
  icon: {
    color: 'gray',
  },
  iconButton: {
    padding: 10,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    width: '100%',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    backgroundColor: 'white',
  },
  countryText: {
    fontSize: 16,
    color: 'black',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkedCheckbox: {
    backgroundColor: 'pink',
  },
  checkmark: {
    color: 'white',
  },
  agreeText: {
    color: 'white',
  },
  linkText: {
    color: 'pink',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'pink',
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  signInText: {
    color: 'white',
  },
  signInLink: {
    color: 'pink',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    padding: 20,
  },
  closeButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'pink',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignUp;
