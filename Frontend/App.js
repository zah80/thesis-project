import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens'; // Import for native screens
import Onboarding1 from './src/screens/onboarding1';
import Onboarding2 from './src/screens/onboarding2';
import Onboarding3 from './src/screens/onboarding3';
import SignIn from './src/screens/signIn';
import SignUp from './src/screens/signUp';
import WorkerSignIn from './src/screens/workerSignIn';
import WorkerSignUp from './src/screens/workerSignUp';

// Enable native screens for better performance
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="onboarding1"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current }) => {
            const opacity = current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            });
            return {
              cardStyle: {
                opacity,
              },
            };
          },
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 250 } },
            close: { animation: 'timing', config: { duration: 250 } },
          },
        }}
      >
        <Stack.Screen name="onboarding1" component={Onboarding1} />
        <Stack.Screen name="onboarding2" component={Onboarding2} />
        <Stack.Screen name="onboarding3" component={Onboarding3} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="WorkerSignIn" component={WorkerSignIn}/>
        <Stack.Screen name="WorkerSignUp" component={WorkerSignUp}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}