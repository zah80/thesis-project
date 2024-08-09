import React, { useContext,useState,useEffect } from 'react';
import {MyContext} from '../../context/ContextProvider'
import {  View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, Button, Modal, TextInput, Platform,Image  } from 'react-native';
import axios from "axios"
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
const SearchedPost=()=>{
    const {url,countries,jobs,laborerDetails,tokenLaborer}=useContext(MyContext);
    const [countryID,setCountryID]=useState("all")
    const [jobID,setJobID]=useState("all");
    const [allSearchedPosts,setAllSearchedPosts]=useState([]);
    const [editCommentID,setEditCommentID]=useState(null);
    const [textComment,setTextComment]=useState("");
    const [textCommentAdd,setTextCommentAdd]=useState("");
    useEffect(()=>{
        fetchPosts();
    },[]);
const fetchPosts=async()=>{
    try {
      console.log("country is",countryID);
      console.log("job is",jobID);
        const country=countryID==="all"?null:countryID
        const job=jobID==="all"?null:jobID;
        const response = await axios.post(`${url}/api/posts/searchedPosts`, { countryID:country, jobID:job });
        setAllSearchedPosts(response.data.results);
        console.log("responsedata post",response.data);
        console.log("res posts",response.data.results);
      } catch (error) {
        console.error('Error fetching posts', error);
      }
}
    const AllSearchedPosts=()=>{
        fetchPosts();
    }
const handleDeleteComment=async(commentID)=>{
    try{
        await axios.delete(`${url}/api/posts/deleteComment/${commentID}`);
        allSearchedPosts();
      } catch (error) {
        console.log('Error deleting comment', error);
      }
}
const handleUpdateComment=async(commentID)=>{
    try {
        await axios.post(`${url}/api/posts/editComment/${commentID}`, { text: textComment });
        AllSearchedPosts();
        setEditCommentID(null);
        setTextComment('');
        
      } catch (error) {
        console.log('Error updating comment', error);
      }
}
   const handleAddComment=async(postID)=>{
    const token =tokenLaborer;
    try {
      const response = await axios.post(`${url}/api/posts/addComment/${postID}`, {  text: textCommentAdd,
      }, {
        headers: {
          token
        }
      });
      console.log("response for add ",response);
      setTextCommentAdd(""); 
      fetchPosts(); 
    } catch (error) {
      console.error('Error adding comment', error);
    }
   }
    const renderComment = ({ item }) => (
        <View style={styles.commentContainer}>
          {item.laborerImage && (
            <Image source={{ uri: url+item.laborerImage }} style={styles.commentImage} />
          )}
          <View style={styles.commentContent}>
          {editCommentID === item.commentID ? (
         <>
         <TextInput
            style={styles.commentInput}
            value={textComment}
            onChangeText={setTextComment}
            
          />
          <View style={styles.commentActions}>
          <TouchableOpacity onPress={() => handleUpdateComment(item.commentID)}>
            <Text style={styles.commentAction}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setEditCommentID(null);
            setTextComment('');
          }}>
            <Text style={styles.commentAction}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </>
        ) : (
          <Text style={styles.commentText}>{item.tex}</Text>
        )}
            <Text style={styles.commentDate}>{new Date(item.sent_at).toLocaleString()}</Text>
            <Text style={styles.commentAuthor}>{item.laborerFullName}</Text>
            {item.laborerID === laborerDetails.laborerID &&editCommentID!==item.commentID&& (
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => {
              setTextComment(item.tex);
                setEditCommentID(item.commentID);
            }}>
              <Text style={styles.commentAction}>edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteComment(item.commentID)}>
              <Text style={styles.commentAction}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
          </View>
        </View>
      );
    
      const renderItem = ({ item }) =>{
        console.log("itempost",item);
        console.log("itemcomments",item.comments);
        return(
        <View style={styles.postContainer}>
          {item.userImage && (
            <Image source={{ uri:url+"/"+ item.userImage }} style={styles.postImage} />
          )}
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{item.text}</Text>
            <Text style={styles.postDate}>{new Date(item.sent_at).toLocaleString()}</Text>
            <Text style={styles.postAuthor}>{item.userFullName}</Text>
            <Text style={styles.postJob}>{item.jobName}</Text>
            <Text style={styles.postCountry}>{item.countryName}</Text>
          </View>
          <FlatList
            data={item.comments}
            keyExtractor={(comment) => comment.commentID.toString()}
            renderItem={renderComment}
          />
          <TextInput
          placeholder="Add a comment..."
          value={textCommentAdd}
          onChangeText={setTextCommentAdd}
          style={styles.commentInput}
        />
        <Button title="Add Comment" onPress={() => handleAddComment(item.posts_jobID)} />

        </View>
      );
}
      return (
        <View style={styles.container}>
          <Picker
            selectedValue={countryID}
            onValueChange={(itemValue)=>setCountryID(itemValue === 'all' ? undefined : itemValue)}
          >
            <Picker.Item label="All Countries" value="all" />
            {countries.map((country) => (
              <Picker.Item key={country.countryID} label={country.countryName} value={country.countryID} />
            ))}
          </Picker>

          <Picker
            selectedValue={jobID}
            onValueChange={(itemValue) => setJobID(itemValue === 'all' ? undefined : itemValue)}
          >
            <Picker.Item label="All Jobs" value="all" />
            {jobs.map((job) => (
              <Picker.Item key={job.jobID} label={job.jobName} value={job.jobID} />
            ))}
          </Picker>
    
          <TouchableOpacity onPress={AllSearchedPosts} style={styles.button}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
    
          <FlatList
            data={allSearchedPosts}
            keyExtractor={(item) => item.posts_jobID.toString()}
            renderItem={renderItem}
          />
        </View>
      );
    };
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
          backgroundColor: '#f8f9fa',
        },
        button: {
          marginTop: 16,
          paddingVertical: 12,
          paddingHorizontal: 24,
          backgroundColor: '#007bff',
          borderRadius: 8,
          alignItems: 'center',
        },
        buttonText: {
          color: '#fff',
          fontSize: 16,
          fontWeight: 'bold',
        },
        postContainer: {
          padding: 16,
          marginBottom: 16,
          backgroundColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 1,
        },
        postImage: {
          height: 200,
          width: '100%',
          borderRadius: 8,
          marginBottom: 8,
        },
        postContent: {
          marginTop: 8,
        },
        postTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 4,
        },
        postDate: {
          fontSize: 14,
          color: '#777',
          marginBottom: 4,
        },
        postAuthor: {
          fontSize: 16,
          color: '#007bff',
          marginBottom: 4,
        },
        postJob: {
          fontSize: 16,
          color: '#555',
          marginBottom: 4,
        },
        postCountry: {
          fontSize: 16,
          color: '#555',
        },
        commentContainer: {
          flexDirection: 'row',
          marginTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
          paddingTop: 8,
        },
        commentImage: {
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 8,
        },
        commentContent: {
          flex: 1,
        },
        commentText: {
          fontSize: 14,
          color: '#333',
        },
        commentDate: {
          fontSize: 12,
          color: '#777',
          marginBottom: 4,
        },
        commentAuthor: {
          fontSize: 14,
          color: '#007bff',
          marginBottom: 4,
        },
        commentActions: {
          flexDirection: 'row',
          marginTop: 4,
        },
        commentAction: {
          marginRight: 8,
          fontSize: 14,
          color: '#007bff',
          fontWeight: 'bold',
        },
        commentInput: {
          borderBottomWidth: 1,
          borderBottomColor: '#007bff',
          paddingVertical: 4,
          marginBottom: 8,
          fontSize: 14,
          color: '#333',
        },
      });
      

export default SearchedPost