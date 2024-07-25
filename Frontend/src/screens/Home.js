import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Modal, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const [laborers, setLaborers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [laborersModalVisible, setLaborersModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const defaultProfileIcon = 'https://img.freepik.com/vecteurs-libre/icon-profile_1284-9290.jpg'; // Add a default profile icon URL here

  const fetchLaborers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.100.10:3000/api/laborers/allLaborers');
      const { result } = response.data; // Extract the 'result' property
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
      const response = await axios.get('http://192.168.100.10:3000/api/jobs/');
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
              <View key={laborer.id} style={styles.serviceCard}>
                <Image
                  source={{ uri: 'https://img.freepik.com/photos-gratuite/carreleur-travaillant-renovation-appartement_23-2149278553.jpg' }}
                  style={styles.serviceImage}
                />
                <Animated.Text style={[styles.serviceTitle, animatedStyle]}>{laborer.fullName}</Animated.Text>
                <Text style={styles.serviceProvider}>Barry</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noServiceText}>No services available</Text>
          )}
        </ScrollView>

        <View style={styles.postJobContainer}>
          <Text style={styles.postJobText}>
            Didn't find your service? Don't worry, you can post your requirements
          </Text>
          <TouchableOpacity style={styles.postJobButton}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.postJobButtonText}>Post New Job Request</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="book" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="list" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubbles" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Categories</Text>
          <ScrollView>
            {categories.map((category) => (
              <View key={category.id} style={styles.modalItem}>
                <Text>{category.name}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="Close" onPress={() => setCategoriesModalVisible(false)} />
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={laborersModalVisible}
        onRequestClose={() => setLaborersModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Laborers</Text>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              laborers.map((laborer) => (
                <View key={laborer.id} style={styles.modalItem}>
                  <Text>{laborer.fullName}</Text>
                </View>
              ))
            )}
          </ScrollView>
          <Button title="Close" onPress={() => setLaborersModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(50, 0, 150)',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    height: 200,
    width: width,
  },
  headerScrollView: {
    height: '100%',
  },
  headerImage: {
    width: width,
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  viewAll: {
    color: '#007BFF',
  },
  categories: {
    paddingHorizontal: 10,
  },
  category: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  featuredContainer: {
    paddingHorizontal: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  featured: {
    flexDirection: 'row',
    padding: 10,
  },
  featuredItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  featuredImage: {
    width: 150,
    height: 100,
    borderRadius: 10,
  },
  featuredText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  featuredSubText: {
    color: '#555',
    color: 'white',
  },
  allServicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    
  },
  allServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  allServices: {
    paddingHorizontal: 10,
    
  },
  serviceCard: {
    marginRight: 15,
    alignItems: 'center',
    
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    
  },
  serviceTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  serviceProvider: {
    color: 'white',
  },
  noServiceText: {
    textAlign: 'center',
    padding: 20,
  },
  postJobContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  postJobText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  postJobButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  setLaborersModalVisible:{
    

  }
});

export default Home;
