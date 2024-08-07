import React, { useContext,useState } from 'react';
import {MyContext} from '../../context/ContextProvider'
import { View, Text, Image, StyleSheet, FlatList,Alert ,TouchableOpacity,Platform,Client  } from 'react-native';
import axios from "axios"
import * as ImagePicker from "expo-image-picker"; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import * as FileSystem from 'expo-file-system';
const ProfileLaborer = ({navigation}) => {
  console.log(" to profileLaborer")
    const { imagesExperienceOfLaborer, laborerDetails, url,tokenLaborer } = useContext(MyContext);
    const [file, setFile] = useState(null); 
    const [error, setError] = useState(null); 
    const renderExperienceImage = (item) => {
     const urlImage=url +"/" + item.imageUrl 
        console.log("url image",urlImage);
        return (
        
      <Image source={{ uri:urlImage }} style={styles.experienceImage} />
    );
}
    const createFormData = (uri) => {
        console.log("uri ",uri);
        const fileName = uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        const formData = new FormData();
        formData.append('image', {
          name: fileName,
          uri,
          type: `image/${fileType}`,
        });
        return formData;
      };
    const saveChangedImageToDatabase = async (localUri) => {
      const token = tokenLaborer;

      const formData = new FormData();
      const { uri, fileName, mimeType } = localUri;
  
      console.log("name", fileName);
      console.log("uri", uri);
      console.log("type", mimeType);
  
      if (Platform.OS ==='web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('image', blob, fileName || 'upload.jpg');
      } else {
       
        const fileData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        formData.append('image', {
          name: fileName,
          type: mimeType,
          uri: `data:${mimeType};base64,${fileData}`,
        });
      }
  
      try {
        const response = await axios({
          method: 'POST',
          url: `${url}/api/laborers/update`, 
          data: formData,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            token,
          },
        });
  
        console.log(response.data);
        Alert.alert('Success', 'Image uploaded successfully');
      } catch (error) {
        console.log('Error uploading image:', error);
      }
      };
    const pickImage =async () => { 
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

        if (status !== "granted") { 
  
          
            Alert.alert( 
                "Permission Denied", 
                `Sorry, we need camera  
                 roll permission to upload images.` 
            ); 
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
              console.log("result is",result);
            if (!result.canceled) { 
                setFile(result.assets[0].uri); 
                console.log("result",result.uri);
         
                saveChangedImageToDatabase(result.assets[0]);
                setError(null); 
            }
        }
    };

    return (
      <View style={styles.container}>
          <TouchableOpacity style={styles.button} 
                onPress={()=>navigation.navigate("editLaborer")}> 
                <Text style={styles.buttonText}> 
                  edit Laborer
                </Text> 
           
            </TouchableOpacity> 
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: url+laborerDetails.image }} 
            style={styles.profileImage} 
          />
           <Text style={styles.header}> 
                Add Image: 
            </Text>
  
           
            <TouchableOpacity style={styles.button} 
                onPress={pickImage}> 
                <Text style={styles.buttonText}> 
                    Choose Image 
                </Text> 
           
            </TouchableOpacity> 
            {file ? (
          <View style={styles.imageContainer}> 
            <Image source={{ uri: file }} style={styles.image} /> 
            <Text>This is the chosen image</Text>
          </View> 
        ):(
          <View>
            <Text>No image selected</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        )}
          
          <Text style={styles.fullName}>{laborerDetails.fullName}</Text>
          <Text style={styles.experience}>Experience: {laborerDetails.experience}</Text>
          <Text style={styles.phone}>Phone: {laborerDetails.phone}</Text>
          <Text style={styles.job}>Job: {laborerDetails.jobName}</Text>
          <Text style={styles.country}>Country: {laborerDetails.countryName}</Text>
        </View>
        
        {
            imagesExperienceOfLaborer.map((image,index)=>{
                return (
                    renderExperienceImage(image)
                )

                
            })
        }
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },
    fullName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    experience: {
      fontSize: 16,
      marginBottom: 4,
    },
    phone: {
      fontSize: 16,
      marginBottom: 4,
    },
    job: {
      fontSize: 16,
      marginBottom: 4,
    },
    country: {
      fontSize: 16,
      marginBottom: 4,
    },
    experienceList: {
      marginTop: 16,
    },
    experienceImage: {
     width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
      },
      button: {
        backgroundColor: '#0084ff',
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
      },
      errorText: {
        color: 'red',
        marginTop: 10,
      },
  });
export default ProfileLaborer