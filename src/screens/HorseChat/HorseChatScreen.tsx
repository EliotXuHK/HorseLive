import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const HorseChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HorseChat</Text>
      <Text style={styles.content}>与马术爱好者聊天交流！</Text>
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

export default HorseChatScreen;
