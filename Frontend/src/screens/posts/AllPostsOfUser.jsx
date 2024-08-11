import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform,Image  } from 'react-native';
import axios from "axios"
import { useNavigation } from '@react-navigation/native';
const AllPostsOfUser = ({navigation}) => {
    const {url,tokenUser}=useContext(MyContext);
    const [posts,setPosts]=useState([]);
   const fetchPosts=async()=>{
    const token=tokenUser;
    axios.get(`${url}/api/posts/ofUser`,{headers:{token}})
      .then(response => {
        setPosts(response.data);
        console.log("response posts of user",response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the posts!", error);
      });
 
   }
    useEffect(() => {
      fetchPosts();
      }, [url]);
      const removeComment = async (postID,commentID) => {
        try {
          await axios.delete(`${url}/deleteComment/${commentID}`);
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.posts_jobID === postID ? {
                ...post,
                comments: post.comments.filter(comment => comment.comment_postID !== commentID)
              } : post
            )
          );
        } catch (error) {
          console.error("There was an error deleting the comment!", error);
        }
      }
    
      const removePost = async (postID) => {
        try {
          await axios.delete(`${url}/api/posts/delete/${postID}`);
          setPosts(prevPosts => prevPosts.filter(post => post.posts_jobID !== postID));
        } catch (error) {
          console.error("There was an error deleting the post!", error);
        }
      }
      const renderPosts = ({ item }) => (
        <View style={styles.postContainer}>
          <View style={styles.userInfo}>
            <Image source={{ uri:url+'/'+ item.userImage }} style={styles.userImage} />
            <Text style={styles.userName}>{item.userFullName}</Text>
          </View>
          <Text style={styles.text}>{item.text}</Text>
          <Text style={styles.timestamp}>{new Date(item.sent_at).toLocaleString()}</Text>
          <Text style={styles.jobCountry}>the job:{item.jobName} </Text>
          <Text style={styles.jobCountry}>the country:{item.countryName}</Text>
          <TouchableOpacity onPress={() => removePost(item.posts_jobID)} style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Delete Post</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("addEditPost",{postID:item.posts_jobID}) } style={styles.removeButton}>
        <Text style={styles.removeButtonText}>update</Text>
      </TouchableOpacity>
      <FlatList
        data={item.comments}
        keyExtractor={(comment) => comment.comment_postID.toString()}
        renderItem={({ item: comment }) => renderComments(item.posts_jobID, comment)}
      />
        </View>
      );
    
      const renderComments = (postID,comment) => (
        <View style={styles.commentContainer}>
          <Image source={{ uri: url+comment.laborerImage }} style={styles.commentImage} />
          <View style={styles.commentTextContainer}>
            <Text style={styles.commentName}>{comment.laborerFullName}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <Text style={styles.commentTimestamp}>{new Date(comment.sent_at).toLocaleString()}</Text>
            <TouchableOpacity onPress={() => removeComment(postID,comment.comment_postID)} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Delete Comment</Text>
        </TouchableOpacity>
          </View>
        </View>
      );
    
      return (
        <View style={styles.container}>
          <FlatList
            data={posts}
            keyExtractor={(post) => post.posts_jobID.toString()}
            renderItem={renderPosts}
          />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
      },
      postContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
      },
      userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      userName: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      text: {
        fontSize: 14,
        marginBottom: 10,
      },
      timestamp: {
        fontSize: 12,
        color: '#888',
      },
      jobCountry: {
        fontSize: 12,
        color: '#888',
        marginBottom: 10,
      },
      commentContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
      },
      commentImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
      },
      commentTextContainer: {
        flex: 1,
      },
      commentName: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      commentText: {
        fontSize: 14,
      },
      commentTimestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
      },
    });
export default AllPostsOfUser