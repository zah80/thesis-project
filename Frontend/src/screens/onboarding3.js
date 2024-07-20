import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon set

const Onboarding3 = ({ navigation }) => (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
        <View style={styles.container}>
            <Image source={require('../assets/thumbsup.jpg')} style={styles.image} />
            <Text style={styles.text}>Join our community and thumbs up to seamless service exchanges.</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Home')}>
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
        width: 190, 
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
});

export default Onboarding3;
