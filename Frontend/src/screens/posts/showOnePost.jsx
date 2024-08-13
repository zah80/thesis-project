import React, { useContext, useState,useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';

const ShowOnePost = ({ postId }) => {
    const {url,tokenLaborer,laborerDetails}=useContext(MyContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [editCommentID, setEditCommentID] = useState(null);
    const [textComment, setTextComment] = useState("");
    const [textCommentAdd, setTextCommentAdd] = useState("");
    const fetchPostAndComments = async () => {
        try {
          const response = await axios.get(`${url}/api/posts/one/${postId}`);
          setPost(response.data.post);
          setComments(response.data.comments);
        } catch (error) {
          console.error('Error fetching post and comments', error);
        }
      };
    useEffect(() => {
    
  
      fetchPostAndComments();
    }, [postId]);
  
    const handleAddComment = async () => {
      try {
      const response=  await axios.post(`${url}/api/posts/addComment/${postId}`, { text: textCommentAdd }, { headers: { token: tokenLaborer } });
        setTextCommentAdd("");
       
        fetchPostAndComments();
      } catch (error) {
        console.error('Error adding comment', error);
      }
    };
  
    const handleUpdateComment = async (commentID) => {
        try {
            await axios.post(`${url}/api/posts/editComment/${commentID}`, { text: textComment });
            setEditCommentID(null);
            setTextComment('');
        
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.comment_postID === commentID
                  ? { ...comment, text: textComment }
                  : comment
              )
            );
          } catch (error) {
            console.error('Error updating comment', error);
      }
    };
  
    const handleDeleteComment = async (commentID) => {
        try {
            await axios.delete(`${url}/api/posts/deleteComment/${commentID}`);
        
          
            setComments((prevComments) =>
              prevComments.filter((comment) => comment.comment_postID !== commentID)
            );
          } catch (error) {
            console.error('Error deleting comment', error);
          }
    };
  
    const renderComment = ({ item }) => (
      <View style={styles.commentContainer}>
        {item.laborerImage && (
          <Image source={{ uri: `${url}${item.laborerImage}` }} style={styles.commentImage} />
        )}
        <View style={styles.commentContent}>
          {editCommentID === item.comment_postID ? (
            <>
              <TextInput
                style={styles.commentInput}
                value={textComment}
                onChangeText={setTextComment}
              />
              <View style={styles.commentActions}>
                <TouchableOpacity onPress={() => handleUpdateComment(item.comment_postID)}>
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
            <>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentDate}>{new Date(item.sent_at).toLocaleString()}</Text>
              <Text style={styles.commentAuthor}>{item.laborerFullName}</Text>
              {item.laborerID === laborerDetails.laborerID && editCommentID !== item.comment_postID && (
                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => {
                    setTextComment(item.text);
                    setEditCommentID(item.comment_postID);
                  }}>
                    <Text style={styles.commentAction}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteComment(item.comment_postID)}>
                    <Text style={styles.commentAction}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    );
  
    if (!post) {
      return <Text>Loading...</Text>;
    }
  
    return (
      <View style={styles.postContainer}>
        {post.userImage && (
          <Image source={{ uri: `${url}/${post.userImage}` }} style={styles.postImage} />
        )}
          <Text style={styles.postAuthor}>{post.userFullName}</Text>

        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post.text}</Text>
          <Text style={styles.postDate}>{new Date(post.sent_at).toLocaleString()}</Text>
          <Text style={styles.postJob}>{post.jobName}</Text>
          <Text style={styles.postCountry}>{post.countryName}</Text>
        </View>
        <FlatList
          data={comments}
          keyExtractor={(comment) => comment.comment_postID.toString()}
          renderItem={renderComment}
        />
        <TextInput
          placeholder="Add a comment..."
          value={textCommentAdd}
          onChangeText={setTextCommentAdd}
          style={styles.commentInput}
        />
        <Button title="Add Comment" onPress={handleAddComment} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
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
      fontSize: 14,
      color: '#555',
      marginBottom: 4,
    },
    postCountry: {
      fontSize: 14,
      color: '#555',
    },
    commentContainer: {
      flexDirection: 'row',
      marginVertical: 8,
      alignItems: 'center',
    },
    commentImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 8,
    },
    commentContent: {
      flex: 1,
    },
    commentInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      padding: 8,
      marginBottom: 8,
    },
    commentText: {
      fontSize: 14,
      color: '#333',
      marginBottom: 4,
    },
    commentDate: {
      fontSize: 12,
      color: '#777',
    },
    commentAuthor: {
      fontSize: 14,
      color: '#007bff',
    },
    commentActions: {
      flexDirection: 'row',
      marginTop: 8,
    },
    commentAction: {
      fontSize: 14,
      color: '#007bff',
      marginRight: 16,
    },
  });

export default ShowOnePost;
