import React,{useContext,useState,useEffect,useCallback} from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList,Platform ,ScrollView  } from 'react-native';
import * as ImagePicker from "expo-image-picker"; 
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { useNavigation } from '@react-navigation/native';
const EditLaborer = () => {
    const {imagesExperienceOfLaborer, laborerDetails, url, tokenLaborer,jobs,countries,setImagesExperienceOfLaborer
      ,setLaborerDetails
     } = useContext(MyContext);
   
      const navigation = useNavigation();
    const [file,setFile] = useState(null);
    const handleChange = (key, value) => {
      console.log(`Updating ${key} to ${value}`);
      setLaborerDetails(prevState => {
        const newState = { ...prevState, [key]: value };
        console.log('New state:', newState);
        return newState;
      });
    };
    
      const handleJobChange = (id,name) => {
        setLaborerDetails(prevState => ({
          ...prevState,
          jobID: id,
          jobName: name,
        }));
      };
    
      const handleCountryChange = (id,name) => {
        setLaborerDetails(prevState => ({
          ...prevState,
          countryID: id,
          countryName: name,
        }));
      };
      const deleteImage = async (imageID) => {
        try {
          await axios.delete(`${url}/api/laborers/image/${imageID}`);
          setImagesExperienceOfLaborer(prevImages => prevImages.filter(image => image.imageID !== imageID));
          Alert.alert('Success', 'Image deleted successfully');
        } catch (error) {
          console.log('Error deleting image:', error);
          Alert.alert('Error', 'Failed to delete image');
        }
      };
      const renderExperienceImage = (({ item }) => {
        const imageUrl = `${url}/${item.imageUrl}`;
        return (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.experienceImage} />
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteImage(item.imageID)}>
              <AntDesign name="delete" size={24} color="white" />
            </TouchableOpacity>
          </View>
        );
      });

 const saveChangedImagesToDatabase=async(images) => {
  const token = tokenLaborer;
  const formData = new FormData();
  for (const image of images){
    const {uri,fileName,mimeType}=image;
    console.log("name",fileName);
    console.log("uri",uri);
    console.log("type",mimeType);
   
   
    formData.append('images', {
      uri: uri,
      name: fileName,
      type: mimeType,
    });
  
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `${url}/api/laborers/addImages`, 
      data: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        token,
            },
    });
      console.log("result images",response.data.results);
    setImagesExperienceOfLaborer((prevImages) => [...prevImages,...response.data.results]);
    Alert.alert('Success', 'Images uploaded successfully');
  } catch (error) {
    console.log('Error uploading images:', error);
  }
    };

    const pickImages = async () => { 
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
              aspect: [4, 3],
              quality: 1,
            });
            console.log("result is",result);
          if (!result.canceled) { 
              setFile(result.assets); 
              console.log("result",result.uri);
       
              saveChangedImagesToDatabase(result.assets);
             
          }
      }
  };


    const handleUpdate = async () => {
        const token=tokenLaborer;
        try {
            const response = await axios.post(`${url}/api/laborers/update`, {
                fullName: laborerDetails.fullName,
                experience: laborerDetails.experience,
                phone: laborerDetails.phone,
                jobID: laborerDetails.jobID,   
                countryID:laborerDetails.countryID,
              }, {
                headers: {
                   token
                }
            });
            console.log("response update",response.data);
         
            Alert.alert('Success', 'Details updated successfully');
        } catch (error) {
            console.log('Error updating details:', error);
        }
    };
  
    const renderDetailSection = () => (
      <View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Edit Profile</Text>
  
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={24} color="#4A4A4A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={laborerDetails.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Experience"
              value={laborerDetails.experience}
              onChangeText={(text) => handleChange('experience', text)}
            />
          </View>
  
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={24} color="#4A4A4A" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={laborerDetails.phone}
              onChangeText={(text) => handleChange('phone', text)}
            />
          </View>
  
          <Text style={styles.label}>Job</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={laborerDetails.jobID}
              onValueChange={(itemValue) =>
                handleJobChange(itemValue, jobs.find((job) => job.jobID === itemValue)?.jobName)
              }
              style={styles.picker}
            >
              {jobs.map((job) => (
                <Picker.Item key={job.jobID} label={job.jobName} value={job.jobID} />
              ))}
            </Picker>
          </View>
  
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={laborerDetails.countryID}
              onValueChange={(itemValue) =>
                handleCountryChange(itemValue, countries.find((country) => country.countryID === itemValue)?.countryName)
              }
              style={styles.picker}
            >
              {countries.map((country) => (
                <Picker.Item key={country.countryID} label={country.countryName} value={country.countryID} />
              ))}
            </Picker>
          </View>
  
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
    const renderImagesSection = () => (
      <View>
        <View style={styles.imagesSection}>
          <Text style={styles.sectionTitle}>Experience Images</Text>
          <TouchableOpacity style={styles.addImageButton} onPress={pickImages}>
            <AntDesign name="plus" size={24} color="white" />
            <Text style={styles.addImageButtonText}>Add Images</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={imagesExperienceOfLaborer}
          renderItem={renderExperienceImage}
          keyExtractor={(item) => item.imageID.toString()}
          numColumns={2}
          contentContainerStyle={styles.experienceList}
        />
      </View>
    );
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={renderDetailSection}
          ListFooterComponent={renderImagesSection}
        />
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F5F5',
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      margin: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      marginBottom: 16,
      paddingHorizontal: 12,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      height: 48,
      fontSize: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4A4A4A',
      marginBottom: 8,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#E0E0E0',
      borderRadius: 8,
      marginBottom: 16,
      overflow: 'hidden',
    },
    picker: {
      height: 48,
    },
    updateButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    updateButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },
    imagesSection: {
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
    experienceList: {
      marginTop: 16,
    },
    imageContainer: {
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
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#666',
      padding: 12,
      borderRadius: 8,
      margin: 20,
    },
    backButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

export default EditLaborer