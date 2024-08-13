import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Modal, ActivityIndicator, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { MyContext } from '../context/ContextProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowSignsRate from './LaborerDetails/ShowSignsRate';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation(); // Corrected line
  const [laborers, setLaborers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [laborersModalVisible, setLaborersModalVisible] = useState(false);
  const [selectedLaborer, setSelectedLaborer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { url,setTokenUser } = useContext(MyContext);
  const [searchTerm,setSearchTerm]=useState("");
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
      const response = await axios.get(`${url}/api/laborers/allLaborers`);
      const { result } = response.data;
      if (Array.isArray(result)) {
        setLaborers(result);
      } else {
        console.error('Unexpected response format for laborers:', response.data);
        setLaborers([]);
      }
    } catch (error) {
      console.error('Error fetching laborers:', error);
      setLaborers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLaborersByCategory = async (jobID) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/laborers/oneByID/${jobID}`);
      console.log(response);
      const { result } = response.data;
      if (Array.isArray(result)) {
        setLaborers(result);
      } else {
        console.error('Unexpected response format for laborers:', response.data);
        setLaborers([]);
      }
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
      const response = await axios.get(`${url}/api/jobs/`);
      // console.log(response);

      if (Array.isArray(response.data)) {
        setJobs(response.data);
      } else {
        console.error('Unexpected response format for jobs:', response.data);
        setJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaborers();
    fetchCategories();
  }, []);

  const animatedOpacity = useSharedValue(0);
  const animatedPosition = useSharedValue(20);

  useEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: 1000 });
    animatedPosition.value = withTiming(0, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animatedOpacity.value,
    transform: [{ translateY: animatedPosition.value }],
  }));

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    await fetchLaborersByCategory(categoryId);
  };

  const handleViewAllCategories = async () => {
    await fetchCategories();
    setCategoriesModalVisible(true);
  };

  const handleViewAllLaborers = async () => {
    await fetchLaborers();
    setLaborersModalVisible(true);
  };

  const goSendMessage = (laborerID) => {
    setLaborersModalVisible(false);
    navigation.navigate('messages', { laborerID });
  };

  const goShowDetails = (laborerID) => {
    setLaborersModalVisible(false);
    navigation.navigate('laborerDetails', { laborerID });
  };

  const checkConversations = () => {
    setLaborersModalVisible(false);
    navigation.navigate('conversation');
  };

  // Filter laborers based on selected category and search term
  const filteredLaborers = laborers.filter(laborer =>
    (!selectedCategory || laborer.jobId === selectedCategory) &&
    laborer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Ionicons name="search" size={20} color="#000" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.categoriesTitle}>Categories</Text>
          <TouchableOpacity onPress={handleViewAllCategories}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
          <TouchableOpacity onPress={() => fetchLaborers()} style={styles.category}>
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          {jobs.map((job) => (
            <TouchableOpacity key={job.jobID} onPress={() => handleCategorySelect(job.jobID)} style={styles.category}>
              {job.urlIcon ? (
                <Image
                  source={{ uri: job.urlIcon }}
                  style={styles.categoryImage}
                  onError={() => console.log(`Failed to load image for job: ${job.jobName}`)}
                />
              ) : (
                <Text style={styles.noImageText}>No Image</Text>
              )}
              <Animated.Text style={[styles.categoryText, animatedStyle]}>{job.jobName}</Animated.Text>
            </TouchableOpacity>
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
          {filteredLaborers.length > 0 ? (
            filteredLaborers.map((laborer) => (
              <TouchableOpacity
                key={laborer.laborerID}
                style={styles.serviceCard}
                onPress={async () => {
                  const fetchedLaborer = await getOneLaborer(laborer.laborerID);
                  setSelectedLaborer(fetchedLaborer);
                }}
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
                  source={{ uri: laborer.profileImage || 'https://img.freepik.com/vecteurs-libre/icon-profile_1284-9290.jpg' }}
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
          <Ionicons name="home-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
          <Ionicons name="calendar-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Ionicons name="list-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-outline" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {jobs.map((job) => (
              <View key={job.jobID} style={styles.modalItem}>
                {job.urlIcon ? (
                  <Image
                    source={{ uri: job.urlIcon }}
                    style={styles.modalImage}
                    onError={() => console.log(`Failed to load image for job: ${job.jobName}`)}
                  />
                ) : (
                  <Text style={styles.noImageText}>No Image</Text>
                )}
                <Text style={styles.modalText}>{job.jobName}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setCategoriesModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        transparent={true}
        visible={laborersModalVisible}
        onRequestClose={() => setLaborersModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            {filteredLaborers.map((laborer) => (
              <View key={laborer.id} style={styles.modalItem}>
                <Image
                  source={{ uri: laborer.profileImage || 'https://img.freepik.com/vecteurs-libre/icon-profile_1284-9290.jpg' }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalText}>{laborer.fullName}</Text>
                <Button title="Message" onPress={() => goSendMessage(laborer.laborerID)} />
                <Button title="View Details" onPress={() => goShowDetails(laborer.laborerID)} />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setLaborersModalVisible(false)} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Button title="Check Conversations" onPress={checkConversations} />
        </View>
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
    backgroundColor: '#ddd',
  },
  noImageText: {
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    color: '#333',
    backgroundColor: '#ddd',
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
    backgroundColor: '#ddd',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  loadingIndicator: {
    position: 'absolute',
    top: height / 2 - 20,
    left: width / 2 - 20,
  },
});

export default Home;
