import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity, Dimensions, Modal, Button, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation(); // Use useNavigation hook
  const [laborers, setLaborers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
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
      const response = await axios.get('http://192.168.1.19:3000/api/laborers/allLaborers');
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
      const response = await axios.get('http://192.168.1.19:3000/api/jobs/');
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

  // Navigation handlers
  const goToHome = () => navigation.navigate('Home');
  const goToServices = () => navigation.navigate('Services'); // Assuming you have a 'Services' screen
  const goToList = () => navigation.navigate('List'); // Assuming you have a 'List' screen
  const goToChat = () => navigation.navigate('Chat');
  const goToProfile = () => navigation.navigate('UserProfile');

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
        <TouchableOpacity onPress={goToHome}>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToServices}>
          <Ionicons name="book" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToList}>
          <Ionicons name="list" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToChat}>
          <Ionicons name="chatbubble" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={goToProfile}>
          <Ionicons name="person" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(!categoriesModalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Categories</Text>
            {categories.map((category) => (
              <View key={category._id} style={styles.modalItem}>
                <Image
                  source={{ uri: categoryImages[category.name] || defaultProfileIcon }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalItemText}>{category.name}</Text>
              </View>
            ))}
            <Button title="Close" onPress={() => setCategoriesModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    height: 200,
  },
  headerScrollView: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: 200,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#007BFF',
  },
  categories: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  category: {
    marginRight: 10,
    alignItems: 'center',
  },
  categoryImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  categoryText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  featuredContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  featured: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  featuredItem: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
  },
  featuredImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  featuredText: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  featuredSubText: {
    color: '#555',
  },
  allServicesContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  allServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  allServices: {
    paddingVertical: 10,
  },
  serviceCard: {
    width: 150,
    marginRight: 10,
    alignItems: 'center',
  },
  serviceImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  serviceTitle: {
    marginTop: 5,
    fontWeight: 'bold',
  },
  serviceProvider: {
    color: '#555',
  },
  noServiceText: {
    textAlign: 'center',
    color: '#555',
  },
  postJobContainer: {
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  postJobText: {
    fontSize: 16,
    marginBottom: 10,
  },
  postJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  postJobButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  modalImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default Home;
