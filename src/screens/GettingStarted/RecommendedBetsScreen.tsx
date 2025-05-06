import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { Card, Button } from '../../components';
import { Colors, Layout } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

// 模拟数据
const upcomingRace = {
  id: 'race-123',
  name: '香港国际赛事 - 速度挑战赛',
  date: '2025年6月15日',
  time: '下午 3:30',
  location: '沙田赛马场',
  distance: '1200米',
  totalPrize: '¥2,800,000',
  horses: [
    { id: 1, number: 1, name: '风驰电掣', jockey: '莫雷拉', trainer: '方嘉柏', odds: 3.4, form: [1, 2, 1, 3, 1], age: 5 },
    { id: 2, number: 2, name: '飞黄腾达', jockey: '薛恩', trainer: '蔡约翰', odds: 4.2, form: [2, 1, 3, 1, 2], age: 4 },
    { id: 3, number: 3, name: '一日千里', jockey: '潘顿', trainer: '沈集成', odds: 6.5, form: [3, 4, 1, 2, 1], age: 6 },
    { id: 4, number: 4, name: '龙行天下', jockey: '巴度', trainer: '姚本辉', odds: 8.0, form: [4, 2, 2, 3, 5], age: 5 },
    { id: 5, number: 5, name: '鹰击长空', jockey: '何澤堯', trainer: '赖贞义', odds: 12.0, form: [5, 8, 3, 4, 2], age: 4 },
    { id: 6, number: 6, name: '金戈铁马', jockey: '郭能', trainer: '告东尼', odds: 7.5, form: [1, 1, 7, 3, 6], age: 5 },
    { id: 7, number: 7, name: '旭日东升', jockey: '田泰安', trainer: '文家良', odds: 9.0, form: [3, 5, 4, 2, 4], age: 4 },
    { id: 8, number: 8, name: '势如破竹', jockey: '杜苑欣', trainer: '凯利', odds: 16.0, form: [6, 4, 5, 3, 4], age: 3 },
  ],
};

// 推荐组合数据
const recommendedCombinations = [
  {
    id: 'combo-1',
    title: '稳健型组合',
    description: '适合新手的低风险组合',
    risk: '低',
    potentialReturn: '低至中等',
    bets: [
      { type: '单赢', selection: '1号 - 风驰电掣', reasoning: '近期状态佳，五场比赛中三次获胜' },
      { type: '位置', selection: '2号 - 飞黄腾达', reasoning: '一直表现稳定，总是能够冲入前三名' },
    ]
  },
  {
    id: 'combo-2',
    title: '平衡型组合',
    description: '中等风险且回报适中的组合',
    risk: '中',
    potentialReturn: '中等',
    bets: [
      { type: '连赢', selection: '1号和3号', reasoning: '这两匹马都很有实力，有很大机会获得前两名' },
      { type: '位置Q', selection: '2号和6号', reasoning: '这两匹马状态良好，有望冲入前三名' },
    ]
  },
  {
    id: 'combo-3',
    title: '进取型组合',
    description: '高风险高回报的组合',
    risk: '高',
    potentialReturn: '高',
    bets: [
      { type: '三重彩', selection: '1-3-6', reasoning: '根据历史数据和当前状态，这个排序很有可能' },
      { type: '单赢', selection: '5号 - 鹰击长空', reasoning: '虽然赔率较高，但最近表现出色，有爆冷门的可能' },
    ]
  }
];

const RecommendedBetsScreen = () => {
  const [selectedCombo, setSelectedCombo] = useState(recommendedCombinations[0].id);
  const [expandedHorse, setExpandedHorse] = useState<number | null>(null);

  const toggleHorseDetails = (horseId: number) => {
    if (expandedHorse === horseId) {
      setExpandedHorse(null);
    } else {
      setExpandedHorse(horseId);
    }
  };

  // 获取当前选中的组合
  const currentCombo = recommendedCombinations.find(combo => combo.id === selectedCombo);

  // 渲染马匹历史成绩
  const renderFormItem = (position: number) => {
    let bgColor;
    if (position === 1) bgColor = Colors.success;
    else if (position <= 3) bgColor = Colors.warning;
    else bgColor = Colors.error;

    return (
      <View style={[styles.formItem, { backgroundColor: bgColor }]}>
        <Text style={styles.formItemText}>{position}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>下一场赛事推荐</Text>
        <Text style={styles.subtitle}>根据历史数据和专家分析的推荐组合</Text>
      </View>

      {/* 赛事信息卡片 */}
      <Card elevated style={styles.raceCard}>
        <Text style={styles.raceName}>{upcomingRace.name}</Text>
        
        <View style={styles.raceDetails}>
          <View style={styles.raceDetailItem}>
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{upcomingRace.date}</Text>
          </View>
          
          <View style={styles.raceDetailItem}>
            <Ionicons name="time-outline" size={18} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{upcomingRace.time}</Text>
          </View>
          
          <View style={styles.raceDetailItem}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{upcomingRace.location}</Text>
          </View>
          
          <View style={styles.raceDetailItem}>
            <Ionicons name="speedometer-outline" size={18} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{upcomingRace.distance}</Text>
          </View>
          
          <View style={styles.raceDetailItem}>
            <Ionicons name="trophy-outline" size={18} color={Colors.primary} />
            <Text style={styles.raceDetailText}>奖金: {upcomingRace.totalPrize}</Text>
          </View>
        </View>
      </Card>

      {/* 组合选择器 */}
      <Text style={styles.sectionTitle}>选择推荐组合</Text>
      <View style={styles.comboSelector}>
        {recommendedCombinations.map((combo) => (
          <TouchableOpacity
            key={combo.id}
            style={[
              styles.comboTab,
              selectedCombo === combo.id && styles.comboTabActive
            ]}
            onPress={() => setSelectedCombo(combo.id)}
          >
            <Text 
              style={[
                styles.comboTabText,
                selectedCombo === combo.id && styles.comboTabTextActive
              ]}
            >
              {combo.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 所选组合详情 */}
      {currentCombo && (
        <Card style={styles.comboCard}>
          <View style={styles.comboHeader}>
            <Text style={styles.comboTitle}>{currentCombo.title}</Text>
            <View style={[
              styles.riskBadge,
              currentCombo.risk === '低' ? styles.lowRiskBadge : 
              currentCombo.risk === '中' ? styles.mediumRiskBadge : 
              styles.highRiskBadge
            ]}>
              <Text style={styles.riskText}>{currentCombo.risk}风险</Text>
            </View>
          </View>
          
          <Text style={styles.comboDescription}>{currentCombo.description}</Text>
          
          <View style={styles.comboInfoRow}>
            <Text style={styles.comboInfoLabel}>潜在回报:</Text>
            <Text style={styles.comboInfoValue}>{currentCombo.potentialReturn}</Text>
          </View>
          
          <Text style={styles.betListHeader}>推荐投注:</Text>
          {currentCombo.bets.map((bet, index) => (
            <View key={index} style={styles.betItem}>
              <View style={styles.betHeader}>
                <Text style={styles.betType}>{bet.type}</Text>
                <Text style={styles.betSelection}>{bet.selection}</Text>
              </View>
              <Text style={styles.betReasoning}>{bet.reasoning}</Text>
            </View>
          ))}
          
          <Button 
            title="模拟下注此组合" 
            variant="primary"
            style={styles.simulateButton}
          />
        </Card>
      )}

      {/* 参赛马匹列表 */}
      <Text style={styles.sectionTitle}>参赛马匹</Text>
      <Text style={styles.horsesSubtitle}>点击查看详细信息</Text>
      
      {upcomingRace.horses.map((horse) => (
        <TouchableOpacity 
          key={horse.id} 
          style={styles.horseCard}
          onPress={() => toggleHorseDetails(horse.id)}
        >
          <View style={styles.horseHeader}>
            <View style={styles.horseNumberContainer}>
              <Text style={styles.horseNumber}>{horse.number}</Text>
            </View>
            <View style={styles.horseBasicInfo}>
              <Text style={styles.horseName}>{horse.name}</Text>
              <Text style={styles.horseJockey}>骑师: {horse.jockey}</Text>
            </View>
            <View style={styles.horseOddsContainer}>
              <Text style={styles.horseOddsLabel}>赔率</Text>
              <Text style={styles.horseOdds}>{horse.odds}</Text>
            </View>
          </View>
          
          {expandedHorse === horse.id && (
            <View style={styles.horseDetails}>
              <View style={styles.horseDetailRow}>
                <Text style={styles.horseDetailLabel}>训练师:</Text>
                <Text style={styles.horseDetailValue}>{horse.trainer}</Text>
              </View>
              <View style={styles.horseDetailRow}>
                <Text style={styles.horseDetailLabel}>年龄:</Text>
                <Text style={styles.horseDetailValue}>{horse.age}岁</Text>
              </View>
              <View style={styles.horseDetailRow}>
                <Text style={styles.horseDetailLabel}>近期成绩:</Text>
                <View style={styles.formContainer}>
                  {horse.form.map((position, index) => (
                    <React.Fragment key={index}>
                      {renderFormItem(position)}
                    </React.Fragment>
                  ))}
                </View>
              </View>
            </View>
          )}
          
          <Ionicons 
            name={expandedHorse === horse.id ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.textLight}
            style={styles.expandIcon}
          />
        </TouchableOpacity>
      ))}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          以上推荐仅供参考，不构成投注建议。请根据您自己的判断和喜好进行投注。
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
  header: {
    marginBottom: Layout.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  raceCard: {
    marginBottom: Layout.spacing.lg,
  },
  raceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  raceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  raceDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  raceDetailText: {
    marginLeft: Layout.spacing.xs,
    fontSize: 14,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
    marginTop: Layout.spacing.lg,
    color: Colors.text,
  },
  horsesSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: Layout.spacing.md,
  },
  comboSelector: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  comboTab: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
  },
  comboTabActive: {
    borderBottomColor: Colors.primary,
  },
  comboTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  comboTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  comboCard: {
    marginBottom: Layout.spacing.lg,
  },
  comboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  comboTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text,
  },
  riskBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  lowRiskBadge: {
    backgroundColor: Colors.success,
  },
  mediumRiskBadge: {
    backgroundColor: Colors.warning,
  },
  highRiskBadge: {
    backgroundColor: Colors.error,
  },
  riskText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  comboDescription: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  comboInfoRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  comboInfoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    width: 80,
  },
  comboInfoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  betListHeader: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Layout.spacing.sm,
    color: Colors.text,
  },
  betItem: {
    backgroundColor: '#f9f9f9',
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    marginBottom: Layout.spacing.sm,
  },
  betHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  betType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: Layout.spacing.sm,
  },
  betSelection: {
    fontSize: 14,
    color: Colors.text,
  },
  betReasoning: {
    fontSize: 13,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  simulateButton: {
    marginTop: Layout.spacing.md,
  },
  horseCard: {
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Layout.spacing.sm,
    padding: Layout.spacing.sm,
  },
  horseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horseNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  horseNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  horseBasicInfo: {
    flex: 1,
  },
  horseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  horseJockey: {
    fontSize: 14,
    color: Colors.textLight,
  },
  horseOddsContainer: {
    alignItems: 'center',
  },
  horseOddsLabel: {
    fontSize: 12,
    color: Colors.textLight,
  },
  horseOdds: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  expandIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  horseDetails: {
    marginTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.sm,
  },
  horseDetailRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.xs,
  },
  horseDetailLabel: {
    width: 70,
    fontSize: 14,
    color: Colors.textLight,
  },
  horseDetailValue: {
    fontSize: 14,
    color: Colors.text,
  },
  formContainer: {
    flexDirection: 'row',
  },
  formItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  formItemText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    padding: Layout.spacing.md,
    backgroundColor: '#f5f5f5',
    borderRadius: Layout.borderRadius.small,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default RecommendedBetsScreen; 