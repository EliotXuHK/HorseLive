import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';

// 消息类型
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  image?: string; // 图片URI
}

// 常见问题
const commonQuestions = [
  {
    id: '1',
    text: '什么是连赢玩法？',
  },
  {
    id: '2',
    text: '如何查看赔率？',
  },
  {
    id: '3',
    text: '赛马有哪些基本术语？',
  },
  {
    id: '4',
    text: '如何分析马匹表现？',
  },
];

// 初始消息
const initialMessages: Message[] = [
  {
    id: '0',
    text: '你好！我是HorseGPT，你的赛马智能助手。我可以回答赛马相关的任何问题，或分析你上传的赛马图片。请问有什么可以帮到你？',
    sender: 'assistant',
    timestamp: new Date(),
  },
];

const HorseChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  
  // 检查图库权限
  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);
  
  // 发送消息滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  // 发送消息函数
  const sendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;
    
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      image: image,
    };
    
    // 更新消息列表
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // 在实际应用中，这里应该调用OpenAI API
      // 暂时使用模拟响应
      await simulateGpt4oResponse(text, image);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: '抱歉，发生了错误。请稍后再试。',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 模拟GPT-4o响应
  const simulateGpt4oResponse = async (text: string, image?: string) => {
    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    let responseText = '';
    
    if (image) {
      // 处理图像查询
      if (text.includes('赛果') || text.includes('中奖') || text.includes('什么意思')) {
        responseText = '根据图片分析，我看到这是沙田马场第8场比赛的赛果。冠军是2号马"飞黄腾达"，亚军是5号马"鹰击长空"，季军是1号马"风驰电掣"。\n\n如果您下注了位置Q，选择了1号和5号马，恭喜您中奖了！根据赔率，您的投注可获得约3.2倍的派彩。';
      } else if (text.includes('这匹马') || text.includes('表现')) {
        responseText = '从图片中我看到这是3号马"一日千里"。这匹马近期表现不错，在最近的5场比赛中取得了3-3-1-1-2的成绩，总共赢得了320万奖金。\n\n它由著名骑师潘顿策骑，擅长中距离赛事。根据赔率走势，这匹马备受市场看好，是本场比赛的热门之一。';
      } else {
        responseText = '我已分析您上传的图片。这似乎是一张赛马相关的照片，但我需要更具体的问题才能提供详细分析。您可以询问具体的马匹信息、赛果详情或赔率分析等。';
      }
    } else {
      // 处理文本查询
      if (text.includes('连赢') || text.includes('连嬴')) {
        responseText = '连赢(Quinella)是指选择两匹马匹，不论名次排序，只要同时跑入第一及第二名，便可获得派彩的一种玩法。\n\n例如，如果您选择了2号和5号马的连赢，那么不管是2号马第一、5号马第二，还是5号马第一、2号马第二，您都赢得此注。连赢的难度比单独的"独赢"要低，但赔率也相应较低。';
      } else if (text.includes('查看赔率')) {
        responseText = '在我们的应用中，您可以通过以下方式查看赔率：\n\n1. 在"爱好"模块的"实时赔率"页面，您可以看到所有参赛马匹的最新赔率\n2. 在"直播"模块的"赛前信息"页面，点击任何一匹马可查看详细赔率\n3. 您也可以在马匹详情页面查看历史赔率走势图\n\n赔率旁的上下箭头表示赔率相比之前的变化，向下箭头表示赔率降低，胜率提高。';
      } else if (text.includes('组合')) {
        responseText = '在赛马投注中，组合策略很关键。一些常见的组合包括：\n\n1. 保守策略：选择热门马(低赔率)的位置押注\n2. 进取策略：热门马独赢搭配冷门马位置\n3. 高风险高回报：选择多匹马的三重彩或六环彩\n\n根据您的风险偏好，可以选择不同的组合。记住，赔率越高，中奖概率越低，但回报越丰厚。';
      } else {
        responseText = '谢谢您的提问！作为HorseGPT，我专注于赛马相关知识。如果您有关于赛马规则、术语、赛事信息或投注策略的问题，我很乐意为您解答。您也可以上传赛马相关图片，我可以帮您分析其中的信息。';
      }
    }
    
    // 添加助手消息
    const assistantMessage: Message = {
      id: Date.now().toString() + '-response',
      text: responseText,
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
  };
  
  // 拍照功能
  const takePicture = async () => {
    try {
      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!cameraResult.canceled && cameraResult.assets && cameraResult.assets[0]) {
        // 提示用户输入关于图片的问题
        Alert.prompt(
          '添加问题',
          '请输入关于这张图片的问题',
          [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '发送',
              onPress: (text) => {
                if (text) {
                  sendMessage(text, cameraResult.assets[0].uri);
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('错误', '拍摄照片时发生错误，请重试。');
    }
  };
  
  // 从图库选择图片
  const pickImage = async () => {
    if (!galleryPermission) {
      Alert.alert('需要权限', '请允许访问相册权限后再试。');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0]) {
        const uri = result.assets[0].uri;
        // 提示用户输入关于图片的问题
        Alert.prompt(
          '添加问题',
          '请输入关于这张图片的问题',
          [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '发送',
              onPress: (text) => {
                if (text) {
                  sendMessage(text, uri);
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('错误', '选择图片时发生错误，请重试。');
    }
  };
  
  // 点击常见问题
  const handleQuestionPress = (question: string) => {
    sendMessage(question);
  };
  
  // 渲染消息项
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Image
              source={require('../../../assets/horsegpt_avatar.png')}
              style={styles.avatar}
            />
          </View>
        )}
        
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {item.text}
          </Text>
          
          <Text style={styles.timestamp}>
            {`${item.timestamp.getHours()}:${String(item.timestamp.getMinutes()).padStart(2, '0')}`}
          </Text>
        </View>
        
        {isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.userAvatarPlaceholder}>
              <Text style={styles.userAvatarText}>我</Text>
            </View>
          </View>
        )}
      </View>
    );
  };
  
  // 渲染常见问题按钮
  const renderCommonQuestions = () => {
    if (messages.length > 1) return null;
    
    return (
      <View style={styles.commonQuestionsContainer}>
        <Text style={styles.commonQuestionsTitle}>常见问题：</Text>
        <View style={styles.questionButtonsContainer}>
          {commonQuestions.map((question) => (
            <TouchableOpacity
              key={question.id}
              style={styles.questionButton}
              onPress={() => handleQuestionPress(question.text)}
            >
              <Text style={styles.questionButtonText}>{question.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>HorseGPT</Text>
          <Text style={styles.subtitle}>您的赛马智能助手</Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>HorseGPT思考中...</Text>
              </View>
            ) : null
          }
        />
        
        {renderCommonQuestions()}
        
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={takePicture}
          >
            <Ionicons name="camera-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="输入您的问题..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={inputText.trim() ? '#fff' : Colors.textLight} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  userAvatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: Colors.text,
  },
  messageImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(0, 0, 0, 0.4)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: Colors.textLight,
    fontSize: 14,
  },
  commonQuestionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  commonQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.textLight,
  },
  questionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  questionButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  questionButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
});

export default HorseChatScreen;
