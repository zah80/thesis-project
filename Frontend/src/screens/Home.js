import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MyContext } from '../context/ContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowSignsRate from './LaborerDetails/ShowSignsRate';


const { width, height } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const [laborers, setLaborers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [laborersModalVisible, setLaborersModalVisible] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { url,setTokenUser } = useContext(MyContext);
  const headerImages = [
    'https://img.freepik.com/photos-gratuite/piece-maison-decoree-dessins-folkloriques-bresiliens_23-2150794161.jpg',
    'https://img.freepik.com/photos-premium/interieur-elegant-canape-modulaire-design-neutre-cadres-affiches-maquettes-fauteuil-rotin-tables-basses-fleurs-sechees-dans-vase-decoration-accessoires-personnels-elegants-dans-decor-moderne_431307-4607.jpg',
    'https://img.freepik.com/photos-gratuite/design-interieur-cadres-photo-plantes_23-2149385437.jpg',
    'https://img.freepik.com/photos-premium/salon-canape-plante-cactus-plante-pot_31965-94545.jpg',
    'https://img.freepik.com/photos-premium/mur-blanc-cadres-lettres-noires-qui-disent-mon-amour-est-maison_1142932-1501.jpg',
  ];

  const categoryImages = {
    Plumber: 'https://img.freepik.com/vecteurs-libre/concept-plombier-symboles-carriere-travail-illustration-vectorielle-isometrique_1284-81752.jpg',
    Electrician: 'https://img.freepik.com/vecteurs-libre/illustration-vectorielle-delectricien_1284-5141.jpg',
    Automotive: 'https://img.freepik.com/vecteurs-libre/illustration-vectorielle-automobile_1284-1121.jpg',
    Construction: 'https://img.freepik.com/vecteurs-libre/construction-illustration_1284-232.jpg',
    Painter: 'https://img.freepik.com/vecteurs-libre/illustration-painter_1284-3060.jpg',
  };
const logout=async()=>{
  await AsyncStorage.removeItem("tokenUser");
  setTokenUser("");
}
  const defaultProfileIcon = 'https://img.freepik.com/vecteurs-libre/icon-profile_1284-9290.jpg';

  const fetchLaborers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url+'/api/laborers/allLaborers');
      const { result } = response.data; // Extract the 'result' property
      if (Array.isArray(result)) {
        setLaborers(result);
      } else {
        console.error('Unexpected response format for laborers:', response.data);
        setLaborers([]);
      }
      console.log("uhsfjd");
    } catch (error) {
      console.error('Error fetching laborers:', error);
      setLaborers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url+'/api/jobs/');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Unexpected response format for categories:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const animatedOpacity = useSharedValue(0);
  const animatedPosition = useSharedValue(20);

  useEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: 1000 });
    animatedPosition.value = withTiming(0, { duration: 1000 });
    fetchLaborers();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [{ translateY: animatedPosition.value }],
  }));

  const handleViewAllCategories = async () => {
    await fetchCategories();
    setCategoriesModalVisible(true);
  };

  const handleViewAllLaborers = async () => {
    await fetchLaborers();
    setLaborersModalVisible(true);
  };
const goSendMessage=(laborerID)=>{
  setLaborersModalVisible(false);
  navigation.navigate("messages",{laborerID})
 
}
const goShowDetails=(laborerID)=>{
  setLaborersModalVisible(false);
  navigation.navigate("laborerDetails",{laborerID})
}
const checkConversations=()=>{
  setLaborersModalVisible(false);
  navigation.navigate("conversation")
}
  return (
    <View style={styles.container}>
     
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.headerScrollView}
          >
            {headerImages.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.headerImage}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="ios-search" size={20} color="#000" />
          <TextInput placeholder="Search" style={styles.searchInput} />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity onPress={handleViewAllCategories}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          {Object.keys(categoryImages).map((category) => (
            <View key={category} style={styles.category}>
              <Image
                source={{ uri: categoryImages[category] }}
                style={styles.categoryImage}
              />
              <Animated.Text style={[styles.categoryText, animatedStyle]}>{category}</Animated.Text>
            </View>
          ))}
        
        </ScrollView>

        <View style={styles.featuredContainer}>
          <Text style={styles.featuredTitle}>Featured</Text>
          <TouchableOpacity onPress={handleViewAllLaborers}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
          <Button title="add posts " onPress={() => navigation.navigate("addEditPost")} />
          <Button title="show all your  posts" onPress={() => navigation.navigate("allPostsOfUser")} />
        </View>

        <View style={styles.featured}>
          <View style={styles.featuredItem}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoFSN4Gmp1g6RBenGExiSMPKlXX0pg7jnkCw&s' }}
              style={styles.featuredImage}
            />
            <Animated.Text style={[styles.featuredText, animatedStyle]}>Plumbing Repo...</Animated.Text>
            <Text style={styles.featuredSubText}>Water Heater Installation</Text>
          </View>
        </View>

        <View style={styles.allServicesContainer}>
          <Text style={styles.allServicesTitle}>All Services</Text>
          <TouchableOpacity onPress={handleViewAllLaborers}>
            <Text style={styles.viewAll}>View All</Text>
            

          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.allServices}>
          {laborers.length > 0 ? (
            laborers.map((laborer) => (
              <TouchableOpacity
                key={laborer.id}
                style={styles.serviceCard}
                onPress={async () => {
                  const fetchedLaborer = await getOneLaborer(id);
                  setSelectedLaborer(fetchedLaborer);
                }} // Trigger the function when a laborer is tapped
              >
               {laborer.ratingCount > 0 ? (
  <View>
    <ShowSignsRate rating={laborer.averageRating} /> 
    <Text>number users rate: {laborer.ratingCount}</Text>
  </View>
) : (
  <Text>no rate found</Text>
)}
                <Image
                  source={{ uri: 'https://img.freepik.com/photos-gratuite/carreleur-travaillant-renovation-appartement_23-2149278553.jpg' }}
                  style={styles.serviceImage}
                />
                <Animated.Text style={[styles.serviceTitle, animatedStyle]}>{laborer.fullName}</Animated.Text>
                <Text style={styles.serviceProvider}>{laborer.profession}</Text>
                <TouchableOpacity onPress={()=>navigation.navigate("sendJobRequest",{laborerID:laborer.laborerID})}>
            <Text style={styles.viewAll}>send job request</Text>
          </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noServiceText}>No services available</Text>
          )}
        </ScrollView>        
        {selectedLaborer && (
          <View style={styles.laborerDetailsContainer}>
            <Text style={styles.laborerName}>{selectedLaborer.fullName}</Text>
            <Text style={styles.laborerProfession}>{selectedLaborer.profession}</Text>
            <Text style={styles.laborerDescription}>{selectedLaborer.description}</Text>
            {/* Display more details as needed */}
          </View>
        )}
        <View style={styles.postJobContainer}>
        <Button title="showConversation" onPress={()=> checkConversations()}/> 
          <Text style={styles.postJobText}>
            Didn't find your service? Don't worry, you can post your requirements
          </Text>
          <TouchableOpacity style={styles.postJobButton}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.postJobButtonText}>Post a Job</Text>
          </TouchableOpacity>
        </View>
        <Button title="logout" onPress={() =>  logout()} />
      </ScrollView>
      
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Ionicons name="grid-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Laborers')}>
          <Ionicons name="people-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Modal visible={categoriesModalVisible} animationType="slide" onRequestClose={() => setCategoriesModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScrollView>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  // Handle category selection
                  setCategoriesModalVisible(false);
                }}
              >
                <Image source={{ uri: categoryImages[category.name] }} style={styles.modalImage} />
                <Text style={styles.modalText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Button title="Close" onPress={() => setCategoriesModalVisible(false)} />
      </Modal>

      <Modal visible={laborersModalVisible} animationType="slide" onRequestClose={() => setLaborersModalVisible(false)}>
        <View style={styles.modalContainer}>
          <ScrollView>
            {laborers.map((laborer) => (
              <TouchableOpacity
                key={laborer.laborerID}
                style={styles.modalItem}
                onPress={async () => {
                  const fetchedLaborer = await getOneLaborer(laborer.laborerID);
                  setSelectedLaborer(fetchedLaborer);
                  setLaborersModalVisible(false);
                }}
              >
                <Image source={{ uri: url+laborer.image }} style={styles.modalImage} />
                <Text style={styles.modalText}>{laborer.fullName}</Text>
                <Button title="send Messages" onPress={()=> goSendMessage(laborer.laborerID)}/> 
                <Button title="show Laborer Details and rate him " onPress={()=>goShowDetails(laborer.laborerID)}/> 
              </TouchableOpacity>
              
              
            ))}
          </ScrollView>
        </View>
       

        <Button title="Close" onPress={() => setLaborersModalVisible(false)} />
      

      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  header: {
    height: height * 0.3,
  },
  headerScrollView: {
    width: '100%',
    height: '100%',
  },
  headerImage: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  categories: {
    paddingLeft: 20,
    marginTop: 15,
  },
  category: {
    marginRight: 20,
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  featured: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 15,
  },
  featuredItem: {
    width: width * 0.7,
    height: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 15,
  },
  featuredImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,
    marginBottom: 10,
  },
  featuredText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  featuredSubText: {
    fontSize: 14,
    color: '#888',
  },
  allServicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
  },
  allServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  allServices: {
    paddingLeft: 20,
    marginTop: 15,
  },
  serviceCard: {
    width: width * 0.7,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 15,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceProvider: {
    fontSize: 14,
    color: '#888',
  },
  noServiceText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  laborerDetailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 15,
  },
  laborerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  laborerProfession: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  laborerDescription: {
    fontSize: 14,
    color: '#666',
  },
  postJobContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  postJobText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  postJobButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Home;

