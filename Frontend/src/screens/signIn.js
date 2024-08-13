import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MyContext } from '../context/ContextProvider';

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const {url,setTokenLaborer,setTokenUser}=useContext(MyContext);

  const handleSignIn = async () => {
    console.log('Attempting to sign in with:', { email, password });
    await   AsyncStorage.removeItem('tokenLaborer');
    setTokenLaborer("");
    try {
      const response = await axios.post(url+'/api/users/login', {
        email,
        password,
      });
  
      console.log('Server response:', response);
  
      if (response.status === 200 && response.data.success) {
        const { token,userId} = response.data;

    

        await AsyncStorage.setItem('tokenUser', token); 
     
        Alert.alert('Login Successful', 'Welcome back!');

setTokenUser(token)

        navigation.navigate('Home',{userId});
      } else {
        console.log('Unexpected response:', response.data);
        Alert.alert('Login Failed', 'Please check your email and password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', 'Please check your email and password');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Hello Again!</Text>

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#666"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setShowPassword(prevState => !prevState)}
        >
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
        <Icon name="arrow-right" size={20} color="#fff" style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.text}>Don't have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
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
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
    paddingLeft: 10, 
  },
  icon: {
    color: '#666',
  },
  iconButton: {
    padding: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
  },
  signUpText: {
    fontSize: 16,
    color: 'pink',
    marginTop: 5,
  },
});

export default SignIn;
