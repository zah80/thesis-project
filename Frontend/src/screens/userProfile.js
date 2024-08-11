import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Button, TextInput, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MyContext } from '../context/ContextProvider';

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
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
            const userId = response.data.user.userID
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

        if (!result.canceled && result.assets && result.assets.length > 0) {
            console.log('Selected image URI:', result.assets[0].uri);
            setTempImage(result.assets[0].uri);
        }
    };

    const updateUserPicture = async (uri) => {
        try {
            await fetchUserData();
            console.log('User ID before upload:', userId);

            if (!userId) {
                setError('User ID is not available');
                return;
            }

            // Optimistically update UI
            setUser(prevUser => ({
                ...prevUser,
                image: uri,
            }));

            const formData = new FormData();
            formData.append('image', {
                uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });

            const response = await axios.put(`${url}/api/users/${userId}/update-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Image upload response:', response.data);

            // Update the user data with the response
            setUser(prevUser => ({
                ...prevUser,
                image: response.data.imageUrl,
            }));

            console.log('User data after upload:', user);

        } catch (error) {
            setError(error.message);
        }
    };

    const updateUserData = async () => {
        try {
            await fetchUserData();
            const userID = user._id;

            if (!userID) {
                setError('User ID is not available');
                return;
            }

            const response = await axios.put(`${url}/api/users/${userID}/update`, updatedData);

            console.log('User data update response:', response.data);

            setUser(prevUser => ({
                ...prevUser,
                ...updatedData,
            }));

            setUpdateModalVisible(false);

        } catch (error) {
            setError(error.message);
        }
    };

    const confirmImageSelection = () => {
        console.log('Image selected:', tempImage);
        setSelectedImage(tempImage);
        updateUserPicture(tempImage);
        setModalVisible(false);
    };

    const image = user.image || selectedImage || null;
    const fullName = user.fullName || 'User Name';
    const email = user.email || 'user@example.com';
    

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.image} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderText}>No Image</Text>
                            </View>
                        )}
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
                <TouchableOpacity>
                    <Ionicons name="home" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="book" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="list" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="chatbubble" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name="person" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Button title="Pick an image from camera roll" onPress={requestPermissionAndPickImage} />
                    {tempImage && (
                        <View>
                            <Image source={{ uri: tempImage }} style={styles.imagePreview} />
                            <Button title="Confirm" onPress={confirmImageSelection} />
                        </View>
                    )}
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={updateModalVisible}
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.modalView}>
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
                    <Button title="Update" onPress={updateUserData} />
                    <Button title="Close" onPress={() => setUpdateModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9F9F9',
    },
    scrollView: {
        flex: 1,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#CCCCCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#FFFFFF',
    },
    changeImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#007BFF',
        borderRadius: 20,
        padding: 8,
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    userID: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 8,
        elevation: 1,
    },
    optionText: {
        marginLeft: 16,
        fontSize: 16,
    },
    logoutButton: {
        padding: 16,
        backgroundColor: '#FF3B30',
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        width: '80%',
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginBottom: 16,
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginVertical: 16,
    },
});

export default UserProfile;
