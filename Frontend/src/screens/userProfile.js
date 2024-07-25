import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            console.log('Retrieved Token:', token);

            if (!token) {
                console.error('Token is not available');
                setError('Token is not available');
                return;
            }

            const response = await axios.get('http://192.168.1.19:3000/api/users/one', { headers: { token } });

            console.log('User Data Response:', response.data);
            setUser(response.data.user);
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const profilePic = user.image || null; // Use 'image' field
    const fullName = user.fullName || 'User Name';
    const email = user.email || 'user@example.com';

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Profile Section */}
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        {profilePic ? (
                            <Image source={{ uri: profilePic }} style={styles.profilePicture} />
                        ) : (
                            <TouchableOpacity style={styles.addPictureButton}>
                                <Ionicons name="add-circle-outline" size={40} color="#000" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.fullName}>{fullName}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>

                {error && <Text style={styles.errorText}>Error: {error}</Text>}

                {/* General Section */}
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

                {/* About App Section */}
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

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Bottom Navigation Bar */}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    profileContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profilePictureContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePicture: {
        width: '100%',
        height: '100%',
    },
    addPictureButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    fullName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    logoutButton: {
        backgroundColor: '#f00',
        padding: 15,
        alignItems: 'center',
        marginVertical: 20,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#f0f0f0',
    },
});

export default UserProfile;
