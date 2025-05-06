import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from '../../constants';

// 导入子页面
import OddsOverviewScreen from './OddsOverviewScreen';
import DataAnalysisScreen from './DataAnalysisScreen';
import BettingCartScreen from './BettingCartScreen';

// 创建顶部标签导航器
const Tab = createMaterialTopTabNavigator();

const HobbiesScreen = () => {
  useEffect(() => {
    console.log('HobbiesScreen mounted');
    return () => console.log('HobbiesScreen unmounted');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>赛马数据分析</Text>
        <Text style={styles.headerSubtitle}>专业赔率分析和赛事预测</Text>
      </View>
      <View style={styles.tabContainer}>
        <Tab.Navigator
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
            name="OddsOverview" 
            component={OddsOverviewScreen} 
            options={{ tabBarLabel: '实时赔率' }} 
          />
          <Tab.Screen 
            name="DataAnalysis" 
            component={DataAnalysisScreen} 
            options={{ tabBarLabel: '数据分析' }} 
          />
          <Tab.Screen 
            name="BettingCart" 
            component={BettingCartScreen} 
            options={{ tabBarLabel: '投注组合' }} 
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
    padding: 16,
    paddingTop: 10,
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

export default HobbiesScreen;
