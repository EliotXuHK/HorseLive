import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Colors } from '../../constants';

// 导入子页面
import RulesScreen from './RulesScreen';
import RecommendedBetsScreen from './RecommendedBetsScreen';
import BettingTutorialScreen from './BettingTutorialScreen';

const Tab = createMaterialTopTabNavigator();

const GettingStartedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarIndicatorStyle: { backgroundColor: Colors.primary },
            tabBarLabelStyle: styles.tabLabel,
            tabBarStyle: styles.tabBar,
            swipeEnabled: true,
          }}
        >
          <Tab.Screen 
            name="Rules" 
            component={RulesScreen} 
            options={{ tabBarLabel: '玩法规则' }} 
          />
          <Tab.Screen 
            name="RecommendedBets" 
            component={RecommendedBetsScreen} 
            options={{ tabBarLabel: '推荐组合' }} 
          />
          <Tab.Screen 
            name="BettingTutorial" 
            component={BettingTutorialScreen} 
            options={{ tabBarLabel: '下注教程' }} 
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

export default GettingStartedScreen; 