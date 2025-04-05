import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors, Layout } from '../../constants';

// 导入子页面
import PreRaceInfoScreen from './PreRaceInfoScreen';
import LiveRaceScreen from './LiveRaceScreen';
import InteractiveZoneScreen from './InteractiveZoneScreen';

// 创建顶部标签导航器
const Tab = createMaterialTopTabNavigator();

const LiveStreamScreen = () => {
  const [upcomingRace, setUpcomingRace] = useState({
    id: 'race-2025-05-23-05',
    name: '沙田马场 - 短途锦标赛',
    location: '沙田赛马场',
    date: '2025年5月23日',
    time: '14:45',
    status: 'upcoming', // live, upcoming, completed
    distance: '1200米',
    isLive: false,
    timeToStart: 125 // 秒
  });
  
  // 模拟比赛状态更新
  useEffect(() => {
    const timer = setInterval(() => {
      setUpcomingRace(prev => {
        // 如果倒计时结束，开始直播
        if (prev.timeToStart <= 0 && !prev.isLive) {
          return { ...prev, isLive: true, status: 'live' };
        }
        
        // 否则继续倒计时
        if (prev.timeToStart > 0) {
          return { ...prev, timeToStart: prev.timeToStart - 1 };
        }
        
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>赛马直播</Text>
        <Text style={styles.headerSubtitle}>
          {upcomingRace.isLive 
            ? '现在直播: ' + upcomingRace.name 
            : '下场赛事: ' + upcomingRace.name}
        </Text>
      </View>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName={upcomingRace.isLive ? "LiveRace" : "PreRaceInfo"}
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarIndicatorStyle: { 
              backgroundColor: Colors.primary,
              height: 3,
              borderRadius: 3
            },
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            swipeEnabled: true,
          }}
        >
          <Tab.Screen 
            name="PreRaceInfo" 
            component={PreRaceInfoScreen} 
            options={{ tabBarLabel: '赛前信息' }}
            initialParams={{ raceData: upcomingRace }}
          />
          <Tab.Screen 
            name="LiveRace" 
            component={LiveRaceScreen} 
            options={{ tabBarLabel: '实时直播' }}
            initialParams={{ raceData: upcomingRace }}
          />
          <Tab.Screen 
            name="InteractiveZone" 
            component={InteractiveZoneScreen} 
            options={{ tabBarLabel: '互动专区' }}
            initialParams={{ raceData: upcomingRace }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    padding: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 8
  },
  tabContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default LiveStreamScreen;
