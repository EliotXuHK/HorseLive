import React from 'react';
import { 
  StyleSheet, 
  View, 
  ViewProps, 
  SafeAreaView, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '../../constants';

interface ContainerProps extends ViewProps {
  useSafeArea?: boolean;
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  paddingHorizontal?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  useSafeArea = true,
  scroll = false,
  keyboardAvoiding = false,
  paddingHorizontal = true,
  style,
  ...props
}) => {
  const renderContent = () => {
    let content = (
      <View 
        style={[
          styles.container, 
          paddingHorizontal && styles.paddingHorizontal,
          style
        ]} 
        {...props}
      >
        {children}
      </View>
    );

    if (scroll) {
      content = (
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      );
    }

    if (keyboardAvoiding) {
      content = (
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return content;
  };

  if (useSafeArea) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <SafeAreaView style={styles.safeArea}>
          {renderContent()}
        </SafeAreaView>
      </>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
});

export default Container; 