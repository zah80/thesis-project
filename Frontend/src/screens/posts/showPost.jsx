import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, FlatList,SafeAreaView  } from 'react-native';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';
import ShowOnePost from './showOnePost';

const ShowPost = ({route}) => {
    const postID=route.params?.postID ?? null;
  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <ShowOnePost postId={postID} />
    </View>
  </SafeAreaView>
   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Use a background color that matches your app's theme
  },
  content: {
    flex: 1,
  },
});
export default ShowPost