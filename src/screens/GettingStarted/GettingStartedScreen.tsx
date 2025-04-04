import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const GettingStartedScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>入门</Text>
      <Text style={styles.content}>欢迎来到入门页面！</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
  },
});

export default GettingStartedScreen; 