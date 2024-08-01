import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../context/ContextProvider';
import axios from 'axios';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MessageScreen = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { tokenUser, tokenLaborer, url, socket, laborerDetails, userDetails } = useContext(MyContext);
  const { userID, laborerID } = route.params;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        let token = '';
        let data = {};

        if (userID && tokenLaborer) {
          token = tokenLaborer;
          data = { userID };
        } else if (laborerID && tokenUser) {
          token = tokenUser;
          data = { laborerID };
        }

        if (token) {
          const response = await axios.post(`${url}/api/all/messages`, data, { headers: { token } });
          setMessages(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();

    socket.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [userID, laborerID, tokenUser, tokenLaborer]);

  useEffect(() => {
    if (userID && tokenLaborer) {
      socket.emit('markMessagesAsSeen', userID, laborerDetails.laborerID, 'laborer');
    } else if (laborerID && tokenUser) {
      socket.emit('markMessagesAsSeen', userDetails.userID, laborerID, 'user');
    }

    socket.on('messagesSeen', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.userID === data.userID && msg.laborerID === data.laborerID && msg.senderType !== data.senderType && !msg.seen
            ? { ...msg, seen: true }
            : msg
        )
      );
    });

    return () => {
      socket.off('messagesSeen');
    };
  }, [userID, laborerID, tokenLaborer, tokenUser]);

  const handleClickAddMessage = async () => {
    try {
      let addMessage = null;
      let token = '';

      if (userID && tokenLaborer) {
        addMessage = { userID, senderType: 'laborer', text: message };
        token = tokenLaborer;
      } else if (laborerID && tokenUser) {
        addMessage = { laborerID, senderType: 'user', text: message };
        token = tokenUser;
      }

      if (addMessage && token) {
        const response = await axios.post(`${url}/api/sendMessage`, addMessage, { headers: { token } });
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const keyExtractor = (item) => item.messageID ? item.messageID.toString() : Math.random().toString();

  const checkMessagesSeen = (item) => {
    if (tokenLaborer) {
      return item.senderType === 'laborer'
        ? <Icon name="check-circle" size={16} color={item.seen ? 'blue' : 'black'} />
        : null;
    } else if (tokenUser) {
      return item.senderType === 'user'
        ? <Icon name="check-circle" size={16} color={item.seen ? 'blue' : 'black'} />
        : null;
    }
    return null;
  };

  const alignMessage = (item) => {
    if (tokenUser) {
      return item.senderType === 'laborer' ? styles.messageContainerLeft : styles.messageContainerRight;
    } else if (tokenLaborer) {
      return item.senderType === 'laborer' ? styles.messageContainerRight : styles.messageContainerLeft;
    }
    return styles.messageContainerLeft;
  };

  const renderItem = ({ item }) => (
    <View style={alignMessage(item)}>
      <Text style={styles.messageContent}>{item.text}</Text>
      <View style={styles.seenStatusContainer}>
        {checkMessagesSeen(item)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setMessage(text)}
          value={message}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleClickAddMessage}>
          <Icon name="send" size={24} color="#0084ff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  messagesList: {
    flex: 1,
  },
  messageContainerLeft: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#e1ffc7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  messageContainerRight: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
  },
  messageContent: {
    color: '#000',
  },
  seenStatusContainer: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default MessageScreen;
