import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import our screens
import GettingStartedScreen from '../screens/GettingStarted/GettingStartedScreen';
import HobbiesScreen from '../screens/Hobbies/HobbiesScreen';
import LiveStreamScreen from '../screens/LiveStream/LiveStreamScreen';
import HorseChatScreen from '../screens/HorseChat/HorseChatScreen';

// Define our tab navigator params
type RootTabParamList = {
  '入门': undefined;
  '爱好': undefined;
  '直播': undefined;
  'HorseChat': undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any = 'home';

            if (route.name === '入门') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '爱好') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === '直播') {
              iconName = focused ? 'videocam' : 'videocam-outline';
            } else if (route.name === 'HorseChat') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            }

            // @ts-ignore
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
        })}
      >
        <Tab.Screen name="入门" component={GettingStartedScreen} />
        <Tab.Screen name="爱好" component={HobbiesScreen} />
        <Tab.Screen name="直播" component={LiveStreamScreen} />
        <Tab.Screen name="HorseChat" component={HorseChatScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 