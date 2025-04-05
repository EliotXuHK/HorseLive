import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Modal,
  FlatList,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';

// 马匹数据类型
interface Horse {
  id: number;
  number: number;
  name: string;
  age: number;
  weight: number;
  jockey: string;
  trainer: string;
  winOdds: number;
  placeOdds: number;
  previousPerformance: string[];
  bloodline: string;
  image: string;
}

// 赛事数据类型
interface RaceData {
  id: string;
  name: string;
  location: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'completed';
  distance: string;
  isLive: boolean;
  timeToStart: number;
}

// 模拟参赛马匹数据
const participatingHorses: Horse[] = [
  {
    id: 1,
    number: 1,
    name: '风驰电掣',
    age: 4,
    weight: 1190,
    jockey: '莫雷拉',
    trainer: '方嘉柏',
    winOdds: 3.5,
    placeOdds: 1.4,
    previousPerformance: ['1-2-3-5-1', '总奖金: 245万'],
    bloodline: '父系: Dubawi, 母系: Speed Queen',
    image: 'https://example.com/horse1.jpg'
  },
  {
    id: 2,
    number: 2,
    name: '飞黄腾达',
    age: 5,
    weight: 1210,
    jockey: '薛恩',
    trainer: '蔡约翰',
    winOdds: 4.2,
    placeOdds: 1.6,
    previousPerformance: ['2-1-4-2-5', '总奖金: 198万'],
    bloodline: '父系: Frankel, 母系: Rising Star',
    image: 'https://example.com/horse2.jpg'
  },
  {
    id: 3,
    number: 3,
    name: '一日千里',
    age: 4,
    weight: 1150,
    jockey: '潘顿',
    trainer: '告东尼',
    winOdds: 5.0,
    placeOdds: 1.8,
    previousPerformance: ['3-3-1-1-2', '总奖金: 320万'],
    bloodline: '父系: Galileo, 母系: Swift Runner',
    image: 'https://example.com/horse3.jpg'
  },
  {
    id: 4,
    number: 4,
    name: '龙行天下',
    age: 6,
    weight: 1230,
    jockey: '巴度',
    trainer: '姚本辉',
    winOdds: 7.5,
    placeOdds: 2.2,
    previousPerformance: ['5-4-2-1-3', '总奖金: 180万'],
    bloodline: '父系: Deep Impact, 母系: Flying Dragon',
    image: 'https://example.com/horse4.jpg'
  },
  {
    id: 5,
    number: 5,
    name: '鹰击长空',
    age: 3,
    weight: 1120,
    jockey: '何澤堯',
    trainer: '沈集成',
    winOdds: 10.0,
    placeOdds: 3.0,
    previousPerformance: ['4-5-3-2-6', '总奖金: 95万'],
    bloodline: '父系: Sea The Stars, 母系: Sky Hunter',
    image: 'https://example.com/horse5.jpg'
  },
  {
    id: 6,
    number: 6,
    name: '金戈铁马',
    age: 5,
    weight: 1200,
    jockey: '郭能',
    trainer: '徐雨石',
    winOdds: 9.0,
    placeOdds: 2.7,
    previousPerformance: ['3-4-5-3-4', '总奖金: 120万'],
    bloodline: '父系: Kingman, 母系: Iron Lady',
    image: 'https://example.com/horse6.jpg'
  },
  {
    id: 7,
    number: 7,
    name: '旭日东升',
    age: 4,
    weight: 1170,
    jockey: '田泰安',
    trainer: '苏保羅',
    winOdds: 15.0,
    placeOdds: 4.5,
    previousPerformance: ['7-5-6-4-2', '总奖金: 85万'],
    bloodline: '父系: Shamardal, 母系: Rising Sun',
    image: 'https://example.com/horse7.jpg'
  },
  {
    id: 8,
    number: 8,
    name: '势如破竹',
    age: 3,
    weight: 1110,
    jockey: '杜苑欣',
    trainer: '叶楚航',
    winOdds: 25.0,
    placeOdds: 7.0,
    previousPerformance: ['6-8-5-7-3', '总奖金: 45万'],
    bloodline: '父系: Lope de Vega, 母系: Bamboo Princess',
    image: 'https://example.com/horse8.jpg'
  }
];

const PreRaceInfoScreen = ({ route }) => {
  const { raceData } = route.params || {
    raceData: {
      id: 'race-2025-05-23-05',
      name: '沙田马场 - 短途锦标赛',
      location: '沙田赛马场',
      date: '2025年5月23日',
      time: '14:45',
      status: 'upcoming',
      distance: '1200米',
      isLive: false,
      timeToStart: 125
    }
  };
  
  const [selectedHorse, setSelectedHorse] = useState<Horse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
  // 格式化倒计时
  const formatTimeToStart = (seconds: number): string => {
    if (seconds <= 0) return '比赛即将开始';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // 切换提醒开关
  const toggleReminder = () => {
    setReminderEnabled(previousState => !previousState);
    // 实际应用中，这里应调用推送通知API设置提醒
  };
  
  // 查看马匹详情
  const viewHorseDetails = (horse: Horse) => {
    setSelectedHorse(horse);
    setModalVisible(true);
  };
  
  // 渲染马匹项
  const renderHorseItem = ({ item }: { item: Horse }) => (
    <TouchableOpacity 
      style={styles.horseItem} 
      onPress={() => viewHorseDetails(item)}
    >
      <View style={styles.horseNumberContainer}>
        <Text style={styles.horseNumber}>{item.number}</Text>
      </View>
      <View style={styles.horseInfo}>
        <Text style={styles.horseName}>{item.name}</Text>
        <Text style={styles.horseSubInfo}>{item.jockey} | {item.trainer}</Text>
      </View>
      <View style={styles.oddsContainer}>
        <Text style={styles.oddsLabel}>独赢</Text>
        <Text style={styles.oddsValue}>{item.winOdds}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // 渲染马匹详情模态框
  const renderHorseDetailsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close-circle" size={28} color={Colors.text} />
          </TouchableOpacity>
          
          {selectedHorse && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.horseHeader}>
                <View style={[styles.horseBigNumberContainer, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.horseBigNumber}>{selectedHorse.number}</Text>
                </View>
                <View style={styles.horseTitleContainer}>
                  <Text style={styles.horseDetailName}>{selectedHorse.name}</Text>
                  <Text style={styles.horseDetailSubtitle}>
                    {selectedHorse.age}岁 | {selectedHorse.weight}磅
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>基本信息</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>骑师:</Text>
                  <Text style={styles.detailValue}>{selectedHorse.jockey}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>练马师:</Text>
                  <Text style={styles.detailValue}>{selectedHorse.trainer}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>血统:</Text>
                  <Text style={styles.detailValue}>{selectedHorse.bloodline}</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>赛绩</Text>
                {selectedHorse.previousPerformance.map((perf, index) => (
                  <Text key={index} style={styles.perfText}>{perf}</Text>
                ))}
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>当前赔率</Text>
                <View style={styles.oddsDetailContainer}>
                  <View style={styles.oddsDetailBox}>
                    <Text style={styles.oddsDetailLabel}>独赢</Text>
                    <Text style={styles.oddsDetailValue}>{selectedHorse.winOdds}</Text>
                  </View>
                  <View style={styles.oddsDetailBox}>
                    <Text style={styles.oddsDetailLabel}>位置</Text>
                    <Text style={styles.oddsDetailValue}>{selectedHorse.placeOdds}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>分析师观点</Text>
                <Text style={styles.analysisText}>
                  {selectedHorse.name}本赛季表现稳定，在过去的5场比赛中有{
                    selectedHorse.previousPerformance[0].split('-').filter(p => parseInt(p) <= 3).length
                  }次冲入三甲。{selectedHorse.jockey}对{raceData.location}赛道非常熟悉，
                  且在{raceData.distance}距离上有出色发挥。本场比赛预计{
                    selectedHorse.winOdds < 8 ? '有机会争胜' : selectedHorse.winOdds < 15 ? '可能冲击名次' : '挑战较大'
                  }。
                </Text>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 比赛信息卡片 */}
        <Card elevated style={styles.raceInfoCard}>
          <View style={styles.raceInfo}>
            <Text style={styles.raceName}>{raceData.name}</Text>
            
            <View style={styles.raceDetails}>
              <View style={styles.raceDetailItem}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                <Text style={styles.raceDetailText}>{raceData.date}</Text>
              </View>
              
              <View style={styles.raceDetailItem}>
                <Ionicons name="time-outline" size={16} color={Colors.primary} />
                <Text style={styles.raceDetailText}>{raceData.time}</Text>
              </View>
              
              <View style={styles.raceDetailItem}>
                <Ionicons name="location-outline" size={16} color={Colors.primary} />
                <Text style={styles.raceDetailText}>{raceData.location}</Text>
              </View>
              
              <View style={styles.raceDetailItem}>
                <Ionicons name="resize-outline" size={16} color={Colors.primary} />
                <Text style={styles.raceDetailText}>{raceData.distance}</Text>
              </View>
            </View>
          </View>
          
          {/* 倒计时 */}
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownLabel}>距离开赛</Text>
            <Text style={styles.countdownTime}>{formatTimeToStart(raceData.timeToStart)}</Text>
            
            <View style={styles.reminderContainer}>
              <Text style={styles.reminderText}>赛前提醒</Text>
              <Switch
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={reminderEnabled ? '#fff' : '#f4f3f4'}
                ios_backgroundColor={Colors.border}
                onValueChange={toggleReminder}
                value={reminderEnabled}
              />
            </View>
          </View>
        </Card>
        
        {/* 参赛马匹列表 */}
        <View style={styles.horsesContainer}>
          <Text style={styles.horsesTitle}>参赛马匹</Text>
          <Text style={styles.horsesSubtitle}>点击马匹查看详细信息</Text>
          
          {participatingHorses.map(horse => renderHorseItem({ item: horse }))}
        </View>
      </ScrollView>
      
      {/* 马匹详情模态框 */}
      {renderHorseDetailsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  raceInfoCard: {
    margin: Layout.spacing.md,
    padding: Layout.spacing.md,
  },
  raceInfo: {
    marginBottom: Layout.spacing.md,
  },
  raceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  raceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  raceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
    marginBottom: Layout.spacing.xs,
  },
  raceDetailText: {
    marginLeft: 6,
    fontSize: 14,
    color: Colors.text,
  },
  countdownContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  countdownLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Layout.spacing.sm,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Layout.spacing.sm,
  },
  reminderText: {
    fontSize: 14,
    color: Colors.text,
  },
  horsesContainer: {
    margin: Layout.spacing.md,
  },
  horsesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  horsesSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: Layout.spacing.md,
  },
  horseItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    alignItems: 'center',
  },
  horseNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  horseNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  horseInfo: {
    flex: 1,
  },
  horseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  horseSubInfo: {
    fontSize: 12,
    color: Colors.textLight,
  },
  oddsContainer: {
    alignItems: 'center',
  },
  oddsLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  oddsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    zIndex: 10,
  },
  horseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  horseBigNumberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  horseBigNumber: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
  },
  horseTitleContainer: {
    flex: 1,
  },
  horseDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  horseDetailSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  detailSection: {
    marginBottom: Layout.spacing.lg,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    width: 70,
    fontSize: 14,
    color: Colors.textLight,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  perfText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  oddsDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  oddsDetailBox: {
    width: '48%',
    backgroundColor: '#f0f8ff',
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.md,
    alignItems: 'center',
  },
  oddsDetailLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  oddsDetailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  analysisText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
});

export default PreRaceInfoScreen; 