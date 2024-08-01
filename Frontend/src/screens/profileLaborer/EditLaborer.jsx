import React,{useContext,useState} from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList, Picker,Platform   } from 'react-native';
import * as ImagePicker from "expo-image-picker"; 
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const EditLaborer = () => {
    const {imagesExperienceOfLaborer, laborerDetails, url, tokenLaborer,jobs,countries,setImagesExperienceOfLaborer } = useContext(MyContext);
    const [details, setDetails] = useState({
        fullName: laborerDetails.fullName,
        experience: laborerDetails.experience,
        phone: laborerDetails.phone,
        jobID: laborerDetails.jobID,
        jobName: laborerDetails.jobName,
        countryID: laborerDetails.countryID,
        countryName: laborerDetails.countryName,
        error: null,
      });
      const navigation = useNavigation();
    const [file,setFile] = useState(null);

    const handleChange = (key, value) => {
        setDetails(prevState => ({ ...prevState, [key]: value }));
      };
    
      const handleJobChange = (id,name) => {
        setDetails(prevState => ({
          ...prevState,
          jobID: id,
          jobName: name,
        }));
      };
    
      const handleCountryChange = (id,name) => {
        setDetails(prevState => ({
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
      const renderExperienceImage = ({ item }) => {
        const imageUrl = `${url}/${item.imageUrl}?timestamp=${new Date().getTime()}`;
        console.log('Image URL:', imageUrl);
        console.log('Image ID:', item.imageID);
      
        return (
         <View>
            <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.experienceImage}/>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={()=>deleteImage(item.imageID)}>
              <AntDesign name="delete" size={24} color="white" />
            </TouchableOpacity>
          <View>
             
          </View>
         </View>
       
        );
      };

 const saveChangedImagesToDatabase=async(images) => {
  const token = tokenLaborer;
  const formData = new FormData();
  for (const image of images){
    const {uri,fileName,mimeType}=image;
    console.log("name",fileName);
    console.log("uri",uri);
    console.log("type",mimeType);
    if(Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append('images', blob, fileName || 'upload.jpg');
    } else {
      const fileData = await FileSystem.readAsStringAsync(uri,{
        encoding: FileSystem.EncodingType.Base64,
      });
      formData.append('images', {
        name: fileName,
        type: mimeType,
        uri: `data:${mimeType};base64,${fileData}`,
      });
    }
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
              allowsEditing: true,
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
                fullName: details.fullName,
                experience: details.experience,
                phone: details.phone,
                jobID: details.jobID,   
                countryID:details.countryID,
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

    return (
        <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={details.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Experience"
          value={details.experience}
          onChangeText={(text) => handleChange('experience', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={details.phone}
          onChangeText={(text) => handleChange('phone', text)}
        />
        
        <Text style={styles.label}>Job</Text>
        <Picker
          selectedValue={details.jobID}
          onValueChange={(itemValue, itemIndex) => handleJobChange(itemValue, jobs.find(job => job.jobID === itemValue)?.jobName)}
        >
          {jobs.map(job => (
            <Picker.Item key={job.jobID} label={job.jobName} value={job.jobID} />
          ))}
        </Picker>
        
        <Text style={styles.label}>Country</Text>
        <Picker
          selectedValue={details.countryID}
          onValueChange={(itemValue, itemIndex) => handleCountryChange(itemValue, countries.find(country => country.countryID === itemValue)?.countryName)}
        >
          {countries.map(country => (
            <Picker.Item key={country.countryID} label={country.countryName} value={country.countryID} />
          ))}
        </Picker>
        
        <Button title="Update Details" onPress={handleUpdate} />
        
        <Text style={styles.header}>Add Experience Images:</Text>
            <TouchableOpacity style={styles.button} 
                onPress={pickImages}> 
                <Text style={styles.buttonText}>
                Choose Image
                </Text> 
            </TouchableOpacity> 
        <FlatList
  data={imagesExperienceOfLaborer}
  renderItem={renderExperienceImage}
  keyExtractor={(item) => item.imageID.toString()}
  numColumns={2}
  contentContainerStyle={styles.experienceList}
/>
<Button title="back" onPress={()=>navigate.goBack()}/> 
      </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
      },
      picker: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: '#fff',
      },
      button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      },
      imageContainer: {
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#e0e0e0', // Background color to see container bounds
        width: 160, // Slightly larger than the image
        height: 160,
      },
      image: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
      },
      imageLabel: {
        marginTop: 5,
        fontSize: 14,
        color: '#666',
      },
      experienceList: {
        paddingVertical: 10,
        alignItems: 'center',
      },
      experienceImage: {
        width: 150,
        height: 150,
        margin: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        opacity: 1,
        position: 'relative',
        zIndex: 1,
      },
      deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 15,
        padding: 5,
      },
});


export default EditLaborer