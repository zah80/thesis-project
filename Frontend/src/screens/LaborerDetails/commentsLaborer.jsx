import React,{useContext,useState,useEffect} from 'react'
import { View, Text, TextInput, StyleSheet, Alert, Button, Image, TouchableOpacity, FlatList, Picker,Platform   } from 'react-native';
import * as ImagePicker from "expo-image-picker"; 
import { MyContext } from '../../context/ContextProvider';
import axios from "axios"
import { AntDesign } from '@expo/vector-icons';
import { useNavigation}from '@react-navigation/native';
import ShowSignsRate from './ShowSignsRate';
const CommentsLaborer = ({ laborerID }) => {
    const { url,userDetails,tokenUser } = useContext(MyContext);
    const [comments, setComments] = useState([]);
  const [clickUpdate,setClickUpdate]=useState(false)
  const [updateComment,setUpdateComment]=useState("");
  const [idThisComment,setIdThisComment]=useState(null);
  const [addComment,setAddComment]=useState("");
  const [showRateThisLaborer,setShowRateThisLaborer]=useState(0);
 const [originalRating,setOriginalRating]=useState(0);
  const [isRating ,setIsRating ]=useState(false);
  useEffect(()=>{
        console.log("tokenuser",tokenUser);
        if (laborerID) {
          fetchComments();
          showRateOfUser();
        }
        
      }, [laborerID]);
  const showRateOfUser=async()=>{
    const token=tokenUser;
    try {
        const response = await axios.get(`${url}/api/rating/getRate/${laborerID}`,{headers:{token}});
       if(response.data.success){
        console.log("rate user is ",response.data.rateUser[0].rate);
        setShowRateThisLaborer(response.data.rateUser[0].rate);
        setOriginalRating(response.data.rateUser[0].rate);
       }
       console.log("response rate",response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
  }
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${url}/api/rating/comments/${laborerID}`);
        setComments(response.data);
        console.log("response comment",response.data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
  
    const deleteComment = async (ratingID) => {
      try {
        await axios.delete(`${url}/api/rating/delete/${ratingID}`);
        setComments(prev=>prev.filter((item)=>item.ratingID!==ratingID))
      } catch (error) {
        console.error("Error deleting rating:", error);
      }
    };
  
    const UpdatedComment = async (ratingID) => {
        console.log("updated comment",updateComment);
        try {
            await axios.put(`${url}/api/rating/editComment/${ratingID}`,{comment:updateComment});
            setComments(prev=>prev.map((item)=>{
                if(item.ratingID===ratingID){
                    return { ...item, comment: updateComment };
                }
                return item;
            }))
            setUpdateComment("");
            setIdThisComment(null);
            setClickUpdate(false);
          } catch (error) {
            console.error("Error update rating:", error);
          }
      
    };
    const addNewComment=async()=>{
const token=tokenUser;

        try {
        const result=    await axios.post(`${url}/api/rating/addComment/${laborerID}`,{comment:addComment},{headers:{token}});
      
           setComments([...comments,result.data])
        
            setAddComment("");
          } catch (error) {
            console.error("Error update rating:", error);
          }
    }
 const showPageUpdate=(comment,ratingID)=>{
    setUpdateComment(comment);
    setIdThisComment(ratingID)
    setClickUpdate(true);
 }
 const handleRateSubmit=async()=>{
    const token = tokenUser;
    console.log("showrate",showRateThisLaborer);
    const RATE=showRateThisLaborer?showRateThisLaborer:1;
    try {
      await axios.post(`${url}/api/rating/rateAdd/${laborerID}`, { rate: RATE }, { headers: { token } });
      setOriginalRating(RATE);
      setShowRateThisLaborer(RATE);
      setIsRating(false)
     
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
 }
 const handleCancelRating = () => {
    setShowRateThisLaborer(originalRating);
    setIsRating(false);
  };
  const handleCancelPageUpdate=()=>{
    setIdThisComment(null);
    setClickUpdate(false);
  }
    const renderItem = ({ item }) => {
console.log("item is ",item.image,item.fullName);
    
    return (
      <View style={styles.ratingContainer}>
        <Image source={{ uri: url+"/uploads/"+item.image }} style={styles.userImage} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.fullName}</Text>
          {(clickUpdate&&item.ratingID===idThisComment) ? (
          <>
            <TextInput
              style={styles.commentInput}
              value={updateComment}
              onChangeText={setUpdateComment}
            />
            <View style={styles.updateButtons}>
              <Button title="Save" onPress={()=> UpdatedComment(item.ratingID)} />
              <Button title="Cancel" onPress={handleCancelPageUpdate} color="red" />
            </View>
          </>
        ) : (
          <Text style={styles.comment}>{item.comment}</Text>
        )}
          <Text style={styles.date}>{new Date(item.sent_at).toLocaleDateString()}</Text>
        </View>
    { item.userID===userDetails.userID&&!clickUpdate?<View style={styles.buttonContainer}>
          <Button title="Update" onPress={()=>showPageUpdate(item.comment,item.ratingID)} />
          <Button title="Delete" onPress={() => deleteComment(item.ratingID)} color="red" />
        </View>:<></>
}

     </View>
    );
}
    return (
      <View style={styles.container}>
<View style={styles.ratingSection}>
  {isRating ? (
    <View>
      <ShowSignsRate 
        rating={showRateThisLaborer || 1} 
        onRatingChange={setShowRateThisLaborer} 
        interactive={true} 
      />
      <View style={styles.ratingButtons}>
        <Button title="Submit Rating" onPress={handleRateSubmit} />
        <Button title="Cancel" onPress={handleCancelRating} color="red" />
      </View>
    </View>
  ) : (
    <View>
      <ShowSignsRate rating={showRateThisLaborer || 0} interactive={false} />
      <Button 
        title={showRateThisLaborer ? "Update Rating" : "Add Rating"} 
        onPress={() => setIsRating(true)} 
      />
    </View>
  )}
</View>
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.ratingID.toString()}
        />
        <TextInput
              style={styles.commentInput}
              value={addComment}
              onChangeText={setAddComment}
            />
            <View style={styles.updateButtons}>
              <Button title="Save" onPress={()=> addNewComment()} />
             
            </View>
      </View>
    );
}
export default CommentsLaborer

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    userImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    textContainer: {
      flex: 1,
    },
    userName: {
      fontWeight: 'bold',
    },
    comment: {
      fontSize: 14,
    },
    commentInput: {
      fontSize: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginBottom: 4,
    },
    date: {
      fontSize: 12,
      color: '#888',
    },
    buttonContainer: {
      flexDirection: 'row',
    },
    updateButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
