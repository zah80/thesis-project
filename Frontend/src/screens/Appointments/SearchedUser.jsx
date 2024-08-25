// App.js
import React, { useContext, useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';
import { useNavigation } from '@react-navigation/native';
const  SearchedUser=()=> {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

const {url,setUserAppointment,setAddModalVisible,
  addModalVisible,}=useContext(MyContext);
  const handleSearch = async (text) => {
    console.log("text",text);
    setQuery(text);
    if (text.length > 0) {
      try {
        const response = await axios.get(`${url}/api/users/search?name=${text}`);
        setResults(response.data);
        console.log("response",response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setResults([]);
    }
  };
const navigateAndSetUser=(user)=>{
setUserAppointment(user);
setAddModalVisible(true);
navigation.goBack()
}

return (
  <View style={styles.container}>
    <View style={styles.searchBarContainer}>
      <Icon name="search" size={24} color="#666" style={styles.searchIcon} />
      <TextInput
        placeholder="Search users..."
        onChangeText={handleSearch}
        value={query}
        style={styles.searchInput}
      />
    </View>
    <FlatList
      data={results}
      keyExtractor={(item) => item.userID.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigateAndSetUser(item)}
        >
          {item.image ? (
            <Image
              source={{ uri: `${url}/${item.image}` }}
              style={styles.userImage}
            />
          ) : (
            <View style={[styles.userImage, styles.placeholderImage]}>
              <Icon name="person" size={30} color="#FFF" />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.fullName}</Text>
            <View style={styles.addressContainer}>
              <Icon name="place" size={16} color="#666" />
              <Text style={styles.userAddress}>{item.addresse}</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={24} color="#CCC" />
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.listContainer}
    />
  </View>
);
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    elevation: 2,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  placeholderImage: {
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
});

  

export default SearchedUser