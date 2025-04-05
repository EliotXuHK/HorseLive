import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';

// 问答题数据类型
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number; // 正确选项的索引
  explanation: string;
}

// 趣闻数据类型
interface Trivia {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
}

// 视频集锦数据类型
interface HighlightVideo {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
}

// 模拟问答题数据
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '沙田马场于哪一年投入使用？',
    options: ['1975年', '1978年', '1985年', '1990年'],
    answer: 1,
    explanation: '沙田马场于1978年正式启用，是香港两大赛马场之一。'
  },
  {
    id: 2,
    question: '赛马中的"打和"是指什么？',
    options: ['两匹马同时抵达终点', '比赛被迫中断', '无人下注', '骑师被罚下马'],
    answer: 0,
    explanation: '打和（Dead Heat）是指两匹或更多匹马同时抵达终点，无法分辨谁先到达。'
  },
  {
    id: 3,
    question: '哪一种赛马赌博类型风险最高？',
    options: ['独赢', '位置', '连赢', '三重彩'],
    answer: 3,
    explanation: '三重彩需要预测头三名马匹及其正确排序，因此风险最高，但回报也最丰厚。'
  },
];

// 模拟趣闻数据
const triviaItems: Trivia[] = [
  {
    id: 1,
    title: '史上最贵的赛马',
    content: '2006年，一匹名为"绿色猴子"（Green Monkey）的两岁马驹以1600万美元的天价售出，创下了赛马交易史上的最高纪录。有趣的是，这匹马后来并未在赛场上取得显著成就，仅参加了三场比赛，无一胜利。',
    imageUrl: 'https://example.com/horse1.jpg'
  },
  {
    id: 2,
    title: '最长寿的赛马',
    content: '据记载，名为"Old Billy"的赛马活到了惊人的62岁高龄，成为历史上最长寿的马匹之一。一般赛马的平均寿命约为25-30岁，这一记录至今无人打破。',
    imageUrl: 'https://example.com/horse2.jpg'
  },
  {
    id: 3,
    title: '赛马的超强视力',
    content: '赛马拥有接近360度的视野，仅在正前方和正后方有小角度的盲区。这种广阔的视野使它们能在奔跑中迅速察觉周围环境变化，是进化为草食动物的生存优势。',
    imageUrl: 'https://example.com/horse3.jpg'
  },
];

// 模拟视频集锦数据
const highlightVideos: HighlightVideo[] = [
  {
    id: 1,
    title: '2023年香港杯精彩回顾',
    description: '回顾去年震撼人心的香港杯赛事，见证国际赛马的顶级水平。',
    thumbnailUrl: 'https://example.com/video1.jpg',
    duration: '08:45',
    views: 287452
  },
  {
    id: 2,
    title: '历届浪琴表马术大师赛集锦',
    description: '精选近十年来浪琴表马术大师赛的精彩瞬间，包含多位传奇骑师的杰出表现。',
    thumbnailUrl: 'https://example.com/video2.jpg',
    duration: '12:31',
    views: 156328
  },
  {
    id: 3,
    title: '赛马史上十大爆冷门',
    description: '那些被认为不可能赢的马匹如何创造奇迹，突破重围登顶冠军。',
    thumbnailUrl: 'https://example.com/video3.jpg',
    duration: '15:18',
    views: 432109
  },
  {
    id: 4,
    title: '传奇骑师莫雷拉生涯高光时刻',
    description: '莫雷拉职业生涯中那些令人窒息的精彩表现，展现大师级的骑术技巧。',
    thumbnailUrl: 'https://example.com/video4.jpg',
    duration: '10:27',
    views: 345672
  },
];

const InteractiveZoneScreen = () => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [expandedTrivia, setExpandedTrivia] = useState<number | null>(null);
  
  // 处理选择答案
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
  };
  
  // 下一题
  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuizIndex((prevIndex) => (prevIndex + 1) % quizQuestions.length);
  };
  
  // 切换趣闻展开状态
  const toggleTriviaExpanded = (id: number) => {
    setExpandedTrivia(expandedTrivia === id ? null : id);
  };
  
  // 格式化观看次数
  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };
  
  // 渲染当前问题
  const renderCurrentQuiz = () => {
    const currentQuiz = quizQuestions[currentQuizIndex];
    
    return (
      <Card style={styles.quizCard}>
        <Text style={styles.quizTitle}>赛马知识问答</Text>
        <Text style={styles.questionText}>{currentQuiz.question}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && 
                  (index === currentQuiz.answer ? 
                    styles.correctOption : styles.wrongOption)
              ]}
              onPress={() => handleOptionSelect(index)}
              disabled={selectedOption !== null}
            >
              <Text style={[
                styles.optionText,
                selectedOption === index && 
                  (index === currentQuiz.answer ? 
                    styles.correctOptionText : styles.wrongOptionText)
              ]}>
                {String.fromCharCode(65 + index)}. {option}
              </Text>
              {selectedOption === index && index === currentQuiz.answer && (
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              )}
              {selectedOption === index && index !== currentQuiz.answer && (
                <Ionicons name="close-circle" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>
              {currentQuiz.explanation}
            </Text>
            <TouchableOpacity 
              style={styles.nextButton}
              onPress={handleNextQuestion}
            >
              <Text style={styles.nextButtonText}>下一题</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    );
  };
  
  // 渲染趣闻列表
  const renderTriviaList = () => (
    <View style={styles.triviaContainer}>
      <Text style={styles.sectionTitle}>赛马趣闻</Text>
      
      {triviaItems.map((trivia) => (
        <TouchableOpacity 
          key={trivia.id}
          style={styles.triviaItem}
          onPress={() => toggleTriviaExpanded(trivia.id)}
        >
          <View style={styles.triviaHeader}>
            <Text style={styles.triviaTitle}>{trivia.title}</Text>
            <Ionicons 
              name={expandedTrivia === trivia.id ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.textLight} 
            />
          </View>
          
          {expandedTrivia === trivia.id && (
            <View style={styles.triviaContent}>
              <Text style={styles.triviaText}>{trivia.content}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
  
  // 渲染视频集锦
  const renderHighlightVideos = () => (
    <View style={styles.highlightsContainer}>
      <Text style={styles.sectionTitle}>精彩回顾</Text>
      
      <FlatList
        data={highlightVideos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.highlightsListContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.videoCard}>
            <View style={styles.thumbnailContainer}>
              <Image 
                // 使用网络占位图，而非本地图像
                source={{ uri: 'https://via.placeholder.com/200x120' }} 
                style={styles.thumbnail}
              />
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.videoViews}>{formatViews(item.views)}次观看</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderCurrentQuiz()}
      {renderHighlightVideos()}
      {renderTriviaList()}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          本模块内容仅供娱乐，非官方比赛或投注通道
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  // 问答卡片样式
  quizCard: {
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  optionsContainer: {
    marginBottom: Layout.spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.sm,
  },
  correctOption: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  wrongOption: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  correctOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  wrongOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  explanationContainer: {
    backgroundColor: '#f5f5f5',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    marginTop: Layout.spacing.sm,
  },
  explanationText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  nextButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.small,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // 视频集锦样式
  highlightsContainer: {
    marginBottom: Layout.spacing.lg,
  },
  highlightsListContent: {
    paddingRight: Layout.spacing.md,
  },
  videoCard: {
    width: 200,
    marginRight: Layout.spacing.md,
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
    height: 120,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: Layout.borderRadius.medium,
    borderTopRightRadius: Layout.borderRadius.medium,
  },
  durationBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
  },
  videoInfo: {
    padding: Layout.spacing.sm,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  videoViews: {
    fontSize: 12,
    color: Colors.textLight,
  },
  // 趣闻样式
  triviaContainer: {
    marginBottom: Layout.spacing.lg,
  },
  triviaItem: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: Layout.spacing.sm,
    overflow: 'hidden',
  },
  triviaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  triviaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  triviaContent: {
    padding: Layout.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  triviaText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  footer: {
    marginBottom: Layout.spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default InteractiveZoneScreen; 