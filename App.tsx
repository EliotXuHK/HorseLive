import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 导入屏幕
import GettingStartedScreen from './src/screens/GettingStarted/GettingStartedScreen';
import HobbiesScreen from './src/screens/Hobbies/HobbiesScreen';
import LiveStreamScreen from './src/screens/LiveStream/LiveStreamScreen';
import HorseChatScreen from './src/screens/HorseChat/HorseChatScreen';
import { Colors } from './src/constants';
import { FloatingChatButton } from './src/components/common';

// 定义底部导航参数类型
type RootTabParamList = {
  '新手': undefined;
  '爱好': undefined;
  '直播': undefined;
  'HorseChat': undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  console.log('App rendered - setting up navigation');
  const [currentRouteName, setCurrentRouteName] = useState<string>('');
  const navigationRef = useNavigationContainerRef();
  
  // 监听路由变化，更新当前路由名称
  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', () => {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute) {
        setCurrentRouteName(currentRoute.name);
      }
    });
    
    return unsubscribe;
  }, [navigationRef]);
  
  // 只在非HorseChat页面显示悬浮按钮
  const shouldShowFloatingButton = currentRouteName !== 'HorseChat';
  
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: any = 'home';

              if (route.name === '新手') {
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
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="新手" component={GettingStartedScreen} />
          <Tab.Screen name="爱好" component={HobbiesScreen} />
          <Tab.Screen name="直播" component={LiveStreamScreen} />
          <Tab.Screen name="HorseChat" component={HorseChatScreen} />
        </Tab.Navigator>
        
        {/* 悬浮聊天按钮，仅在非聊天页面显示 */}
        {shouldShowFloatingButton && <FloatingChatButton />}
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
