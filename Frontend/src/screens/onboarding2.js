import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon set

const Onboarding2 = ({ navigation }) => (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
        <View style={styles.container}>
        <TouchableOpacity 
                style={styles.skipButton} 
                onPress={() => navigation.navigate('Redirect')}>
                <View style={styles.skipContent}>
                    <Text style={styles.skipText}>Skip</Text>
                    <Icon name="arrow-right" size={25} color="#fff" style={styles.skipIcon} />
                </View>
            </TouchableOpacity>
            <Image source={require('../assets/handchake.jpg')} style={styles.image} />
            <Text style={styles.text}>Connecting clients and workers, building strong partnerships.</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('onboarding3')}>
                    <Text style={styles.buttonText}>Next</Text>
                    <Icon name="arrow-right" size={20} color="#fff" style={styles.icon} />
                </TouchableOpacity>
               
            </View>
        </View>
    </ImageBackground>
);

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
    image: {
        width: 202, 
        height: 300, 
        marginTop: 20, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: 'white', 
        resizeMode: 'contain',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        margin: 60, 
        textAlign: 'center',
        marginRight: 50,
        marginLeft: 50,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 50,
        width: '30%', 
    },
    buttonWrapper: {
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black', 
        paddingVertical: 8, 
        paddingHorizontal: 15, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: 'white', 
    },
    buttonText: {
        color: '#fff', 
        fontSize: 18, 
        marginLeft: 10, 
    },
    icon: {
        marginLeft: 10, 
    },
    skipButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10, 
    },
    skipContent: {
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    skipText: {
        color: '#fff', 
        fontSize: 16, 
        marginRight: 5, 
    },
    skipIcon: {
        marginLeft: 5, 
    },
});

export default Onboarding2;
