import React, { useContext,useState } from 'react';
import {MyContext} from '../../context/ContextProvider'
import { View, Text, Image, StyleSheet, FlatList,Alert ,TouchableOpacity,Platform,Client, ScrollView} from 'react-native';
import axios from "axios"
import * as ImagePicker from "expo-image-picker"; 
import Icon from 'react-native-vector-icons/FontAwesome'; 
import * as FileSystem from 'expo-file-system';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
const ProfileLaborer = ({navigation}) => {
  console.log(" to profileLaborer")
    const { imagesExperienceOfLaborer, laborerDetails, url,tokenLaborer,setLaborerDetails } = useContext(MyContext);
    const [file, setFile] = useState(null); 
    const [error, setError] = useState(null); 

const renderExperienceImage = (image) => (
  <View key={image.imageID} style={styles.experienceImageContainer}>
    <Image source={{ uri: `${url}/${image.imageUrl}` }} style={styles.experienceImage} />
   
  </View>
);
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
        })

  const imageLab=response.data.laborerUpdates.image;
  setLaborerDetails(prev => ({
    ...prev,
    image: imageLab, 
  }));
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
               
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
              });
              console.log("result is",result);
            if (!result.canceled) { 
                
                console.log("result",result.assets[0]);
                saveChangedImageToDatabase(result.assets[0])
                setFile(result.assets[0].uri)
                setError(null); 
            }
        }
    };

    return (
      <ScrollView style={styles.container}>
      <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        <Image source={{ uri:file?file:url +laborerDetails.image }} style={styles.profileImage} />
        <TouchableOpacity style={styles.changeImageButton} onPress={pickImage}>
          <AntDesign name="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.fullName}>{laborerDetails.fullName}</Text>
          <Text style={styles.jobName}>{laborerDetails.jobName}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("editLaborer")}>
        <AntDesign name="edit" size={20} color="white" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" />
          <Text style={styles.infoText}>Experience: {laborerDetails.experience} years</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={24} color="#4A4A4A" />
          <Text style={styles.infoText}>{laborerDetails.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={24} color="#4A4A4A" />
          <Text style={styles.infoText}>{laborerDetails.countryName}</Text>
        </View>
      </View>

      <View style={styles.experienceSection}>
        <Text style={styles.sectionTitle}>Experience Gallery</Text>
       
        <View style={styles.imageGrid}>
        {
            imagesExperienceOfLaborer.map((image,index)=>{
                return (
                    renderExperienceImage(image)
                )

                
            })
        }
        </View>
      </View>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  jobName: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    margin: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#4A4A4A',
    marginLeft: 12,
  },
  experienceSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  experienceImageContainer: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  experienceImage: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileLaborer