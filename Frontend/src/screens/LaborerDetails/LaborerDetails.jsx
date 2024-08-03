import React,{useContext,useState,useEffect} from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList, Picker,Platform   } from 'react-native';
import * as ImagePicker from "expo-image-picker"; 
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CommentsLaborer from './commentsLaborer';

const LaborerDetails = ({route}) => {
  const [laborer,setLaborer]=useState({});
  const [images,setImages]=useState([]);
  const {url}=useContext(MyContext)
  const {laborerID}=route.params
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLaborerDetails = async () => {
      try {
        const response = await axios.get(`${url}/api/laborers/oneByID/${laborerID}`);
        setLaborer(response.data.laborer);
        setImages(response.data.images);
      
      } catch (error) {
        console.error("Error fetching laborer details:", error);
      }
    };
    fetchLaborerDetails();
  }, [url, laborerID]);

  return (
    <View style={styles.container}>
     
      {laborer.image && (
        <Image source={{ uri: url+laborer.image }} style={styles.laborerImage} />
      )}
      <Text style={styles.title}>{laborer.fullName}</Text>
      <Text style={styles.detail}>Email: {laborer.email}</Text>
      <Text style={styles.detail}>Experience: {laborer.experience}</Text>
      <Text style={styles.detail}>Phone: {laborer.phone}</Text>
      <Text style={styles.detail}>Job: {laborer.jobName}</Text>
      <Text style={styles.detail}>Country: {laborer.countryName}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("messages", { laborerID })}
      >
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
      <FlatList
        data={images}
        keyExtractor={(item) => item.imageID.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri:url+'/'+ item.imageUrl }} style={styles.image} />
        )}
      />

    
      <CommentsLaborer laborerID={laborerID}/>
    </View>
  );
}

export default LaborerDetails
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  laborerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});