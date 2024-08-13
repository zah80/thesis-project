import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';
import ShowOnePost from './showOnePost';

const ShowPost = ({route}) => {
    const postID=route.params?.postID ?? null;
  return (
<View>
      <ShowOnePost postId={postID} />
    </View>  )
}

export default ShowPost