// App.js
import React, { useContext, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet,Image,TouchableOpacity } from 'react-native';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';
import { useNavigation } from '@react-navigation/native';
const  SearchedUser=()=> {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigation = useNavigation();

const {url,setUserAppointment}=useContext(MyContext);
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
navigation.goBack()
}
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.userID.toString()}
        renderItem={({ item }) => (
            
            <View style={styles.item}>
                 <TouchableOpacity onPress={() => navigateAndSetUser(item)}>
                            
                     
            {item.image && (
              <Image
                source={{ uri: `${url}/uploads/${item.image}` }}
                style={styles.userImage}
              />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fullName}</Text>
              <Text style={styles.userAddress}>{item.addresse}</Text>
            </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    userInfo: {
      flexDirection: 'column',
    },
    userName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    userAddress: {
      fontSize: 14,
      color: 'gray',
    },
  });

  

export default SearchedUser