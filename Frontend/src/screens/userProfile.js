import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Button, TextInput, Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MyContext } from '../context/ContextProvider';

const UserProfile = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false); // Added state for update modal visibility
    const [tempImage, setTempImage] = useState(null); // Added state to handle temporary image selection
    const [updatedData, setUpdatedData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        image: '',
    });
    const { url } = useContext(MyContext);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setError('Token is not available');
                return;
            }

            const response = await axios.get(`${url}/api/users/one`, { headers: { token } });
            setUser(response.data.user);
            console.log("users",user.userID);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const requestPermissionAndPickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log('ImagePicker result:', result);
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setTempImage(result.assets[0]);
            console.log('Selected tempImage:', result.assets[0]);
        }
    };
    

    const updateUserPicture = async (tempImage) => {
        console.log('Starting image upload with tempImage:', tempImage); 
        console.log('test the uri:', tempImage.uri);
    
        const formData = new FormData();
        const { uri, fileName, mimeType } = tempImage;
    
        // Handling file format for native and web platforms
        if (Platform.OS === 'web') {
            const response = await fetch(uri);
            const blob = await response.blob();
            formData.append('image', blob, fileName || 'upload.jpg');
        } else {
            // Use FileSystem to read and encode image as Base64 for native platforms
            const fileData = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            formData.append('image', {
                name: fileName,
                type: mimeType,
                uri: `data:${mimeType};base64,${fileData}`,
            });
        }
    
        console.log('FormData before upload:', formData);
    const userID=user.userID;
    console.log("userid",userID);
        try {
            const response = await axios({
                method: 'PUT',
                url: `${url}/api/users/profile-pic/${userID}`,
                data: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Image upload response:', response);
            Alert.alert('Success', 'Image uploaded successfully');
            fetchUserData();
        } catch (error) {
            console.log('Error uploading image:', error);
            Alert.alert('Error', 'Failed to upload image');
        }
    };
    
    const confirmImageSelection = () => {
        if (tempImage) {
            updateUserPicture(tempImage); // Pass tempImage to the update function
            setModalVisible(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${url}/api/users/update`, updatedData, {
                headers: { token },
            });

            console.log('User update response:', response); // Log the response from the server

            if (response.data.success) {
                Alert.alert('Success', 'User details updated successfully');
                setUpdateModalVisible(false); // Close the update modal
                fetchUserData();
            } else {
                Alert.alert('Error', 'Failed to update user details');
            }
        } catch (error) {
            console.error('Error updating user details:', error); // Log the error if update fails
            Alert.alert('Error', 'Failed to update user details');
        }
    };

    const image = user.image || tempImage?.uri || null;
    const fullName = user.fullName || 'User Name';
    const email = user.email || 'user@example.com';
    const imageURL = `${url}/uploads/${image}`;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <Image source={{ uri: imageURL }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.changeImageButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Ionicons name="pencil" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.fullName}>{fullName}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>

                {error && <Text style={styles.errorText}>Error: {error}</Text>}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="wallet-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Wallet History</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="star-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Favourite Providers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="star-half-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Rate Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="chatbubbles-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>My Reviews</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About App</Text>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="information-circle-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>About App</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="lock-closed-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="document-text-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="cash-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Refund Policy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="help-circle-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Help & Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.option}>
                        <Ionicons name="call-outline" size={24} color="#000" />
                        <Text style={styles.optionText}>Helper Number</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={styles.bottomNavigation}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home" size={24} color="#000" />
                    <Text>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="#000" />
                    <Text>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="notifications" size={24} color="#000" />
                    <Text>Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="person" size={24} color="#000" />
                    <Text>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for changing profile picture */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Profile Picture</Text>
                        <TouchableOpacity onPress={requestPermissionAndPickImage} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Pick an Image</Text>
                        </TouchableOpacity>
                        {tempImage && (
                            <Image
                                source={{ uri: tempImage.uri }}
                                style={styles.selectedImage}
                            />
                        )}
                        <TouchableOpacity onPress={confirmImageSelection} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for updating user details */}
            <Modal
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity onPress={() => setUpdateModalVisible(false)} style={styles.modalCloseButton}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Profile</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={updatedData.fullName}
                            onChangeText={(text) => setUpdatedData({ ...updatedData, fullName: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={updatedData.email}
                            onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={updatedData.password}
                            onChangeText={(text) => setUpdatedData({ ...updatedData, password: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={updatedData.address}
                            onChangeText={(text) => setUpdatedData({ ...updatedData, address: text })}
                        />
                        <TouchableOpacity onPress={handleUpdate} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    scrollView: {
        flex: 1,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#d1d1d1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#888',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 50,
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    userID: {
        fontSize: 14,
        color: '#999',
    },
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: '#ff5c5c',
        paddingVertical: 10,
        marginVertical: 20,
        marginHorizontal: 20,
        borderRadius: 5,
    },
    logoutText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#fff',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    previewContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
});

export default UserProfile;