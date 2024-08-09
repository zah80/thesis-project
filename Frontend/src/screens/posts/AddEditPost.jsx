import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform,Image  } from 'react-native';
import axios from "axios"
import { useNavigation } from '@react-navigation/native';

const AddEditPost = ({route}) => {
    const { url } = useContext(MyContext);
    const navigation = useNavigation();
    const postID = route.params?.postID; 
    const [post, setPost] = useState({
      userID: '',
      jobID: null,
      countryID: null,
      text: '',
      image: null,
      countryName:"",
      jobName:"",
    });
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (postID) {
       
        fetchPostById(postID);
      }
    }, [postID]);
    const fetchPostById = async (id) => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${url}/one/${id}`);
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setIsLoading(false);
      }
    };
  
    const handleInputChange = (field, value) => {
      setPost({ ...post, [field]: value });
    };
  
   
    const handleSubmit = async () => {
      try {
        setIsLoading(true);
        if (postID) {
          await axios.put(`${url}/edit/${postID}`, post);
        } else {
          await axios.post(`${url}/create`, post);
        }
        setIsLoading(false);
        navigation.goBack(); 
      } catch (error) {
        console.error('Error saving post:', error);
        setIsLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={post.userID}
          onChangeText={(value) => handleInputChange('userID', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Job ID"
          value={post.jobID}
          onChangeText={(value) => handleInputChange('jobID', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Country ID"
          value={post.countryID}
          onChangeText={(value) => handleInputChange('countryID', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Text"
          value={post.text}
          onChangeText={(value) => handleInputChange('text', value)}
        />
        <Button title="Upload Image" onPress={handleImageUpload} />
      
        <Button title="Save" onPress={handleSubmit} disabled={isLoading} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginTop: 10,
    },
  });

export default AddEditPost