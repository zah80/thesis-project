import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import Home from './src/screens/Home';
import Onboarding1 from './src/screens/onboarding1';
import Onboarding2 from './src/screens/onboarding2';
import Onboarding3 from './src/screens/onboarding3';
import { MyProvider } from './src/context/ContextProvider';
import Conversation from './src/screens/messagesAndConversations/Conversation';
import Redirect from './src/screens/redirectS';
import SignIn from './src/screens/signIn';
import SignUp from './src/screens/signUp';
import UserProfile from './src/screens/userProfile';
import WorkerHome from './src/screens/WorkerHome';
import WorkerSignIn from './src/screens/workerSignIn';
import WorkerSignUp from './src/screens/workerSignUp';
import ProfileLaborer from './src/screens/profileLaborer/ProfileLaborer';
import EditLaborer from './src/screens/profileLaborer/EditLaborer';
import Appointments from './src/screens/Appointments/Appointments';
import AllNotification from './src/screens/Notifications/AllNotification';
import SearchedUser from './src/screens/Appointments/SearchedUser';
import Message from './src/screens/messagesAndConversations/message';
import LaborerDetails from './src/screens/LaborerDetails/LaborerDetails';
import SearchedPost from './src/screens/posts/SearchedPost';
import AllPostsOfUser from './src/screens/posts/AllPostsOfUser';
import AddEditPost from './src/screens/posts/AddEditPost';

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

        
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="onboarding1" component={Onboarding1} />
        <Stack.Screen name="onboarding2" component={Onboarding2} />
        <Stack.Screen name="onboarding3" component={Onboarding3} />
        <Stack.Screen name="conversation" component={Conversation} />
        <Stack.Screen name="messages" component={Message} />
        <Stack.Screen name="Redirect" component={Redirect} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="WorkerHome" component={WorkerHome} />
        <Stack.Screen name="WorkerSignIn" component={WorkerSignIn}/>
        <Stack.Screen name="WorkerSignUp" component={WorkerSignUp}/>
        <Stack.Screen name="profileLaborer" component={ProfileLaborer}/>
        <Stack.Screen name="editLaborer" component={EditLaborer}/>
        <Stack.Screen name="appointment" component={Appointments}/>
        <Stack.Screen name="notification" component={AllNotification}/>
        <Stack.Screen name="searchUser" component={SearchedUser}/>
        <Stack.Screen name="laborerDetails" component={LaborerDetails}/>
        <Stack.Screen name="searchedPost" component={SearchedPost}/>
        <Stack.Screen name="allPostsOfUser" component={AllPostsOfUser}/>
        <Stack.Screen name="addEditPost" component={AddEditPost}/>
      </Stack.Navigator>
    </NavigationContainer>
    </MyProvider>
  );
}
