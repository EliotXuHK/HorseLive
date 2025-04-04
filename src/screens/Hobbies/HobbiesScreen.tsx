import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HobbiesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>爱好</Text>
      <Text style={styles.content}>探索您的爱好和兴趣！</Text>
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

export default HobbiesScreen;
