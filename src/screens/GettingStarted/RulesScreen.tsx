import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Button } from '../../components';
import { Colors, Layout } from '../../constants';

const RulesScreen = () => {
  const bettingTypes = [
    {
      id: 1,
      title: '单赢 (Win)',
      description: '选择一匹马获得第一名',
      difficulty: '简单',
      odds: '中等',
      example: '1号马获得第一名，投注成功',
    },
    {
      id: 2,
      title: '位置 (Place)',
      description: '选择一匹马获得前三名',
      difficulty: '简单',
      odds: '低',
      example: '2号马获得第二名，投注成功',
    },
    {
      id: 3,
      title: '连赢 (Quinella)',
      description: '选择两匹马获得前两名，不分先后顺序',
      difficulty: '中等',
      odds: '较高',
      example: '3号和5号马获得第一和第二名，投注成功',
    },
    {
      id: 4,
      title: '位置Q (Quinella Place)',
      description: '选择两匹马获得前三名，不分先后顺序',
      difficulty: '中等',
      odds: '中等',
      example: '1号和6号马分别获得第一名和第三名，投注成功',
    },
    {
      id: 5,
      title: '三重彩 (Tierce)',
      description: '选择三匹马获得前三名，需按正确顺序排列',
      difficulty: '困难',
      odds: '非常高',
      example: '2号、3号、7号马按顺序获得前三名，投注成功',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>赛马玩法规则</Text>
        <Text style={styles.subtitle}>了解基本赛马博彩规则和术语</Text>
      </View>

      <Card elevated style={styles.introCard}>
        <Text style={styles.introText}>
          赛马博彩是一项需要知识、技巧和一点运气的活动。了解基本规则和投注类型将帮助您做出更明智的决定。
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>常见投注类型</Text>

      {bettingTypes.map((type) => (
        <Card key={type.id} style={styles.typeCard}>
          <View style={styles.typeHeader}>
            <Text style={styles.typeTitle}>{type.title}</Text>
            <View style={[styles.difficultyBadge, 
              type.difficulty === '简单' ? styles.easyBadge : 
              type.difficulty === '中等' ? styles.mediumBadge : 
              styles.hardBadge
            ]}>
              <Text style={styles.difficultyText}>{type.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.typeDescription}>{type.description}</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>赔率水平:</Text>
            <Text style={styles.infoValue}>{type.odds}</Text>
          </View>
          
          <View style={styles.exampleBox}>
            <Text style={styles.exampleTitle}>示例:</Text>
            <Text style={styles.exampleText}>{type.example}</Text>
          </View>
        </Card>
      ))}

      <Text style={styles.sectionTitle}>赔率计算</Text>
      <Card style={styles.oddsCard}>
        <Text style={styles.oddsText}>
          赔率表示您投注可能获得的回报。例如，如果赔率是3.5，您投注100元并赢得比赛，您将获得350元（包括您的本金100元）。
        </Text>
        <View style={styles.formulaBox}>
          <Text style={styles.formulaText}>获利 = 投注金额 × 赔率</Text>
        </View>
        <Text style={styles.oddsNote}>
          请注意，赔率会根据投注情况实时变化，确保在下注前检查最新赔率。
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>赛马术语</Text>
      <Card style={styles.termsCard}>
        <View style={styles.termRow}>
          <Text style={styles.termName}>赛道状况</Text>
          <Text style={styles.termDesc}>描述赛道的整体条件，如"良好"、"湿滑"等</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.termRow}>
          <Text style={styles.termName}>配速</Text>
          <Text style={styles.termDesc}>马匹跑完特定距离所需的时间</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.termRow}>
          <Text style={styles.termName}>起跑闸</Text>
          <Text style={styles.termDesc}>马匹开始比赛的位置</Text>
        </View>
        <View style={styles.divider} />
        
        <View style={styles.termRow}>
          <Text style={styles.termName}>头马</Text>
          <Text style={styles.termDesc}>领先的马匹</Text>
        </View>
      </Card>

      <View style={styles.actionButtons}>
        <Button 
          title="查看视频教程" 
          variant="outline"
          style={styles.actionButton}
        />
        <Button 
          title="常见问题解答" 
          variant="primary"
          style={styles.actionButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          请理性投注，投注前请确认您已年满18周岁
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
  introCard: {
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.primary,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
    color: Colors.text,
  },
  typeCard: {
    marginBottom: Layout.spacing.md,
  },
  typeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  typeTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.text,
  },
  difficultyBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  easyBadge: {
    backgroundColor: Colors.success,
  },
  mediumBadge: {
    backgroundColor: Colors.warning,
  },
  hardBadge: {
    backgroundColor: Colors.error,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  typeDescription: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textLight,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  exampleBox: {
    backgroundColor: '#f5f5f5',
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    marginTop: Layout.spacing.xs,
  },
  exampleTitle: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: Colors.text,
  },
  oddsCard: {
    marginBottom: Layout.spacing.lg,
  },
  oddsText: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  formulaBox: {
    backgroundColor: '#f0f8ff',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.small,
    alignItems: 'center',
    marginVertical: Layout.spacing.md,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  oddsNote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textLight,
  },
  termsCard: {
    marginBottom: Layout.spacing.lg,
  },
  termRow: {
    paddingVertical: Layout.spacing.sm,
  },
  termName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  termDesc: {
    fontSize: 14,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
  footer: {
    marginBottom: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default RulesScreen; 