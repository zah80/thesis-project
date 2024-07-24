import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens'; // Import for native screens
import Onboarding1 from './src/screens/onboarding1';
import Onboarding2 from './src/screens/onboarding2';
import Onboarding3 from './src/screens/onboarding3';
import { MyProvider } from './src/context/ContextProvider';
import Conversation from './src/screens/messagesAndConversations/Conversation';
import Message from './src/screens/messagesAndConversations/message';

// Enable native screens for better performance
enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <MyProvider>

   
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
            open: { animation: 'timing', config: { duration: 250 }  },
           close:  { animation: 'timing', config: { duration: 250 }  },
          },
        }}
      >
        <Stack.Screen name="onboarding1" component={Onboarding1} />
        <Stack.Screen name="onboarding2" component={Onboarding2} />
        <Stack.Screen name="onboarding3" component={Onboarding3} />
        <Stack.Screen name="conversation" component={Conversation} />
        <Stack.Screen name="messages" component={Message} />
      </Stack.Navigator>
    </NavigationContainer>
    </MyProvider>
  );
}