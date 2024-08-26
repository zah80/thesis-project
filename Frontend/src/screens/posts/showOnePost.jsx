import React, { useContext, useState,useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { MyContext } from '../../context/ContextProvider';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ShowOnePost = ({ postId}) => {
    const {url,tokenLaborer,laborerDetails}=useContext(MyContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [editCommentID, setEditCommentID] = useState(null);
    const [textComment, setTextComment] = useState("");
    const [textCommentAdd, setTextCommentAdd] = useState("");
    const [showComments,setShowComments] = useState(false);
    const navigation = useNavigation();

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
    },[postId]);
  
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
                multiline
              />
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleUpdateComment(item.comment_postID)}>
                <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => {
                setEditCommentID(null);
                setTextComment('');
                }}>
                <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{item.laborerFullName}</Text>
                <Text style={styles.commentDate}>{new Date(item.sent_at).toLocaleString()}</Text>
              </View>
              <Text style={styles.commentText}>{item.text}</Text>
              {item.laborerID === laborerDetails.laborerID && editCommentID !== item.comment_postID && (
                <View style={styles.commentActions}>
                  <TouchableOpacity onPress={() => {
                    setTextComment(item.text);
                    setEditCommentID(item.comment_postID);
                  }}>
                    <Ionicons name="pencil" size={18} color="#4267B2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteComment(item.comment_postID)}>
                    <Ionicons name="trash" size={18} color="#4267B2" />
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
      <View style={styles.container}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            {post.userImage && (
              <Image source={{ uri: `${url}/${post.userImage}` }} style={styles.postImage} />
            )}
            <View>
              <Text style={styles.postAuthor}>{post.userFullName}</Text>
              <Text style={styles.postDate}>{new Date(post.sent_at).toLocaleString()}</Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{post.text}</Text>
          <View style={styles.postMeta}>
            <Text style={styles.postMetaText}><Ionicons name="briefcase-outline" size={16} /> {post.jobName}</Text>
            <Text style={styles.postMetaText}><Ionicons name="location-outline" size={16} /> {post.countryName}</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
    

        <TouchableOpacity 
        onPress={() => setShowComments(!showComments)} 
        style={styles.commentButton}>
        <Ionicons name="chatbubble-outline" size={18} color="blue" style={styles.commentIcon} />
        {comments.length > 0 && (
    <Text style={styles.commentCount}>
      {comments.length}
    </Text>
  )}
      </TouchableOpacity>
      <TouchableOpacity 
        onPress={()=>navigation.navigate("messages",{userID:post.userID})} 
        style={styles.messageButton}>
        <Ionicons name="send-outline" size={18} color="blue" style={styles.messageIcon} />
      </TouchableOpacity>


    </View>

     {showComments&&<FlatList
          data={comments}
          keyExtractor={(comment)=>comment.comment_postID.toString()}
          renderItem={renderComment}
          contentContainerStyle={styles.commentsContainer}
        />}
        <View style={styles.addCommentContainer}>
        <TextInput 
            placeholder="Add a comment..."
            value={textCommentAdd}
            onChangeText={setTextCommentAdd}
            style={styles.addCommentInput}
            multiline
        />
        
          <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F0F2F5',
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Ensure buttons are spaced evenly
      marginTop: 10,
    },
    commentButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      // Remove alignSelf or set it to 'center' if necessary
    },
    commentCount: {
      fontSize: 16,
      color: 'blue',
    },
    commentIcon: {
      marginRight: 6,
    },
    commentButtonText: {
      fontSize: 14,
      color: 'blue',
    },
    messageButton: {
      flexDirection: 'row', // Ensure it's the same as commentButton
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      // Remove alignSelf or set it to 'center' if necessary
    },
    messageIcon: {
      marginRight: 6,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      color: '#65676B',
    },
    postContainer: {
      backgroundColor: 'white',
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    postImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    postAuthor: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1C1E21',
    },
    postDate: {
      fontSize: 12,
      color: '#65676B',
    },
    postTitle: {
      fontSize: 16,
      color: '#1C1E21',
      marginBottom: 10,
    },
    postMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    postMetaText: {
      fontSize: 14,
      color: '#65676B',
    },
    commentsContainer: {
      padding: 15,
    },
    commentContainer: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    commentImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
      marginRight: 10,
    },
    commentContent: {
      flex: 1,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    commentAuthor: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#1C1E21',
    },
    commentDate: {
      fontSize: 12,
      color: '#65676B',
    },
    commentText: {
      fontSize: 14,
      color: '#1C1E21',
    },
    commentActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 5,
    },
    actionButton: {
      marginLeft: 10,
    },
    actionButtonText: {
      color: '#4267B2',
      fontSize: 14,
    },
    commentInput: {
      borderColor: '#CCD0D5',
      borderWidth: 1,
      borderRadius: 5,
      padding: 8,
      marginBottom: 5,
    },
    addCommentContainer: {
      flexDirection: 'row',
      padding: 15,
      backgroundColor: 'white',
      borderTopWidth: 1,
      borderTopColor: '#CCD0D5',
    },
    addCommentInput: {
      flex: 1,
      borderColor: '#CCD0D5',
      borderWidth: 1,
      borderRadius: 20,
      padding: 8,
      marginRight: 10,
    },
    addCommentButton: {
      backgroundColor: '#4267B2',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ShowOnePost;
