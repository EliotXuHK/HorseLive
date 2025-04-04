import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const LiveStreamScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>直播</Text>
      <Text style={styles.content}>观看和分享精彩直播内容！</Text>
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

export default LiveStreamScreen;
