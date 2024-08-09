import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform,Image  } from 'react-native';
import axios from "axios"
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const AddEditPost = ({route}) => {
    const { url,tokenUser,jobs,countries } = useContext(MyContext);
    const navigation = useNavigation();
    const postID = route.params?.postID ?? null;; 
    const [post, setPost] = useState({
      jobID:jobs[0].jobID,
      countryID:countries[0].countryID,
      text:'',
      image:null,
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
        console.log("id is ",id);
        const response = await axios.get(`${url}/api/posts/one/${id}`);
        setPost(response.data.post);
        console.log("response of post",response.data.post);
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
        const token=tokenUser;
        if (postID) {
          await axios.post(`${url}/api/posts/edit/${postID}`,post);
      console.log("edit success");
              } else{
          await axios.post(`${url}/api/posts/create`,post,{headers:{token}});
      console.log("added success");
        }
        setIsLoading(false);
      
      } catch (error) {
        console.error('Error saving post:', error);
        setIsLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
     
     <Picker
            selectedValue={post.countryID}
            onValueChange={(itemValue)=>handleInputChange("countryID",itemValue)}
          >
      
            {countries.map((country) => (
              <Picker.Item key={country.countryID} label={country.countryName} value={country.countryID} />
            ))}
          </Picker>

          <Picker
            selectedValue={post.jobID}
            onValueChange={(itemValue) => handleInputChange("jobID",itemValue)}
          >
          
            {jobs.map((job) => (
              <Picker.Item key={job.jobID} label={job.jobName} value={job.jobID} />
            ))}
          </Picker>
        <TextInput
          style={styles.input}
          placeholder="Text"
          value={post.text}
          onChangeText={(value) => handleInputChange('text', value)}
        />
        
      
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