import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const redirect = ({ navigation }) => {
    return (
        <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.userButton} 
                    onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.buttonText}>Sign In as a User</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.workerButton} 
                    onPress={() => navigation.navigate('WorkerSignIn')}>
                    <Text style={styles.buttonText}>Sign In as a Worker</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    },
    userButton: {
        backgroundColor: 'rgb(50, 0, 150)',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    workerButton: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default redirect;
