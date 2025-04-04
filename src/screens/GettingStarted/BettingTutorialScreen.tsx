import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';
import { Card, Button } from '../../components';
import { Colors, Layout } from '../../constants';
import { Ionicons } from '@expo/vector-icons';

// 模拟的下注教程步骤
const tutorialSteps = [
  {
    id: 1,
    title: '选择赛事',
    description: '浏览当前和即将举行的赛事列表，选择您感兴趣的比赛。',
    icon: 'list-outline',
    tips: ['关注赛事级别和类型', '查看赛事时间和地点'],
  },
  {
    id: 2,
    title: '研究参赛马匹',
    description: '查看每匹马的详细信息，包括近期成绩、骑师和训练师情况。',
    icon: 'search-outline',
    tips: ['考虑马匹近期状态', '查看骑师和训练师记录', '了解马匹适合的赛道条件'],
  },
  {
    id: 3,
    title: '选择投注类型',
    description: '根据您的风险偏好和分析，选择适合的投注类型。',
    icon: 'options-outline',
    tips: ['新手可优先考虑单赢和位置', '高回报伴随高风险', '可以组合不同投注类型分散风险'],
  },
  {
    id: 4,
    title: '设定投注金额',
    description: '在APP中输入您希望投注的金额，系统会自动计算可能的回报。',
    icon: 'cash-outline',
    tips: ['设定预算并坚持', '不要追求输钱', '将资金分配到不同的投注上'],
  },
  {
    id: 5,
    title: '确认投注',
    description: '检查您的所有选择，包括马匹、投注类型和金额，确认无误后提交。',
    icon: 'checkmark-circle-outline',
    tips: ['仔细检查所有投注细节', '确认赔率是否符合预期', '投注前想清楚'],
  },
];

// 模拟的常见问题
const faqs = [
  {
    question: '如何开始第一次投注？',
    answer: '新手可以从单赢或位置投注开始，选择一匹状态良好、赔率适中的马匹，投入少量资金尝试。',
  },
  {
    question: '什么是复式投注？',
    answer: '复式投注是指在一种投注类型中选择多个选项，增加中奖几率，但也会增加投注成本。例如，在单赢中选择3匹马，只要其中之一获胜即可盈利。',
  },
  {
    question: '投注前需要考虑哪些因素？',
    answer: '赛道状况、马匹近期成绩、骑师能力、天气条件、马匹适应性等都是影响比赛结果的重要因素。',
  },
  {
    question: '如何读懂赔率？',
    answer: '赔率表示您的投注可能带来的回报倍数。例如，赔率3.5意味着每投注1元，赢得比赛可获得3.5元（包含本金）。赔率越高，获胜概率理论上越低。',
  },
  {
    question: '是否可以取消已经提交的投注？',
    answer: '一般情况下，一旦投注被确认，就不能取消。因此在提交前，请确保仔细检查所有投注细节。',
  },
];

// 模拟交互式投注演示的数据
const demoRace = {
  name: '模拟投注 - 冠军杯',
  horses: [
    { id: 1, number: 1, name: '疾风骏足', odds: 2.8 },
    { id: 2, number: 2, name: '青云之志', odds: 4.5 },
    { id: 3, number: 3, name: '雷霆万钧', odds: 7.2 },
    { id: 4, number: 4, name: '傲雪凌霜', odds: 9.0 },
  ],
};

const BettingTutorialScreen = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [demoStep, setDemoStep] = useState(1);
  
  // 处理FAQ展开/收起
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  // 获取当前的教程步骤
  const currentStep = tutorialSteps.find(step => step.id === activeStep);
  
  // 模拟下注过程
  const handleDemoBetting = () => {
    if (demoStep < 3) {
      setDemoStep(demoStep + 1);
    } else {
      // 重置演示
      setDemoStep(1);
      setSelectedHorse(null);
      setBetAmount(100);
    }
  };
  
  // 渲染模拟下注UI
  const renderDemoBetting = () => {
    if (demoStep === 1) {
      // 步骤1: 选择马匹
      return (
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>第一步: 选择马匹</Text>
          <Text style={styles.demoInstructions}>
            点击下面的一匹马来进行单赢投注
          </Text>
          
          {demoRace.horses.map(horse => (
            <TouchableOpacity
              key={horse.id}
              style={[
                styles.demoHorseItem, 
                selectedHorse === horse.id && styles.selectedHorseItem
              ]}
              onPress={() => setSelectedHorse(horse.id)}
            >
              <View style={styles.demoHorseNumber}>
                <Text style={styles.demoHorseNumberText}>{horse.number}</Text>
              </View>
              <Text style={styles.demoHorseName}>{horse.name}</Text>
              <Text style={styles.demoHorseOdds}>{horse.odds}</Text>
            </TouchableOpacity>
          ))}
          
          <Button 
            title="下一步" 
            disabled={!selectedHorse}
            variant={selectedHorse ? "primary" : "outline"}
            style={styles.demoButton}
            onPress={handleDemoBetting}
          />
        </View>
      );
    } else if (demoStep === 2) {
      // 步骤2: 设置金额
      const selectedHorseData = demoRace.horses.find(h => h.id === selectedHorse);
      const potentialReturn = betAmount * (selectedHorseData?.odds || 0);
      
      return (
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>第二步: 设置投注金额</Text>
          
          <View style={styles.demoSelectionSummary}>
            <Text style={styles.demoSummaryTitle}>已选择:</Text>
            <View style={styles.demoSummaryRow}>
              <Text style={styles.demoSummaryLabel}>投注类型:</Text>
              <Text style={styles.demoSummaryValue}>单赢</Text>
            </View>
            <View style={styles.demoSummaryRow}>
              <Text style={styles.demoSummaryLabel}>马匹:</Text>
              <Text style={styles.demoSummaryValue}>{selectedHorseData?.name} (赔率: {selectedHorseData?.odds})</Text>
            </View>
          </View>
          
          <Text style={styles.demoInstructions}>
            选择投注金额
          </Text>
          
          <View style={styles.amountSelector}>
            <TouchableOpacity 
              style={styles.amountButton}
              onPress={() => setBetAmount(50)}
            >
              <Text style={styles.amountButtonText}>¥50</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.amountButton, styles.amountButtonSelected]}
              onPress={() => setBetAmount(100)}
            >
              <Text style={styles.amountButtonTextSelected}>¥100</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.amountButton}
              onPress={() => setBetAmount(200)}
            >
              <Text style={styles.amountButtonText}>¥200</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.amountButton}
              onPress={() => setBetAmount(500)}
            >
              <Text style={styles.amountButtonText}>¥500</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.returnCalculator}>
            <Text style={styles.returnLabel}>潜在回报:</Text>
            <Text style={styles.returnValue}>¥{potentialReturn.toFixed(2)}</Text>
          </View>
          
          <Button 
            title="下一步" 
            variant="primary"
            style={styles.demoButton}
            onPress={handleDemoBetting}
          />
        </View>
      );
    } else {
      // 步骤3: 确认投注
      const selectedHorseData = demoRace.horses.find(h => h.id === selectedHorse);
      const potentialReturn = betAmount * (selectedHorseData?.odds || 0);
      
      return (
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>第三步: 确认投注</Text>
          
          <Card style={styles.betSummaryCard}>
            <Text style={styles.betSummaryTitle}>投注单</Text>
            
            <View style={styles.betSummarySection}>
              <Text style={styles.betSummaryLabel}>赛事:</Text>
              <Text style={styles.betSummaryValue}>{demoRace.name}</Text>
            </View>
            
            <View style={styles.betSummarySection}>
              <Text style={styles.betSummaryLabel}>投注类型:</Text>
              <Text style={styles.betSummaryValue}>单赢</Text>
            </View>
            
            <View style={styles.betSummarySection}>
              <Text style={styles.betSummaryLabel}>选择:</Text>
              <Text style={styles.betSummaryValue}>{selectedHorseData?.number}号 - {selectedHorseData?.name}</Text>
            </View>
            
            <View style={styles.betSummarySection}>
              <Text style={styles.betSummaryLabel}>赔率:</Text>
              <Text style={styles.betSummaryValue}>{selectedHorseData?.odds}</Text>
            </View>
            
            <View style={styles.betSummarySection}>
              <Text style={styles.betSummaryLabel}>投注金额:</Text>
              <Text style={styles.betSummaryValue}>¥{betAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.betSummaryTotal}>
              <Text style={styles.betSummaryTotalLabel}>可能回报:</Text>
              <Text style={styles.betSummaryTotalValue}>¥{potentialReturn.toFixed(2)}</Text>
            </View>
          </Card>
          
          <Text style={styles.confirmText}>
            请确认以上投注信息是否正确。一旦提交，投注将无法更改。
          </Text>
          
          <Button 
            title="确认投注（模拟）" 
            variant="primary"
            style={styles.demoButton}
            onPress={handleDemoBetting}
          />
        </View>
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>下注教程</Text>
        <Text style={styles.subtitle}>学习赛马投注的基本步骤和技巧</Text>
      </View>

      {/* 步骤导航 */}
      <View style={styles.stepperContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stepper}
        >
          {tutorialSteps.map((step) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepButton,
                activeStep === step.id && styles.activeStepButton
              ]}
              onPress={() => setActiveStep(step.id)}
            >
              <View style={[
                styles.stepNumber,
                activeStep === step.id && styles.activeStepNumber
              ]}>
                <Text style={[
                  styles.stepNumberText,
                  activeStep === step.id && styles.activeStepNumberText
                ]}>{step.id}</Text>
              </View>
              <Text style={[
                styles.stepText,
                activeStep === step.id && styles.activeStepText
              ]}>{step.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 当前步骤详情 */}
      {currentStep && (
        <Card elevated style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <Ionicons name={currentStep.icon as any} size={40} color={Colors.primary} />
            <View style={styles.stepTitleContainer}>
              <Text style={styles.stepTitle}>{currentStep.title}</Text>
              <Text style={styles.stepDescription}>{currentStep.description}</Text>
            </View>
          </View>
          
          <View style={styles.tipsList}>
            <Text style={styles.tipsHeader}>提示:</Text>
            {currentStep.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* 交互式下注演示 */}
      <Text style={styles.sectionTitle}>交互式演示</Text>
      <Card style={styles.demoCard}>
        {renderDemoBetting()}
      </Card>

      {/* 常见问题 */}
      <Text style={styles.sectionTitle}>常见问题</Text>
      {faqs.map((faq, index) => (
        <Card key={index} style={styles.faqCard}>
          <TouchableOpacity
            style={styles.faqHeader}
            onPress={() => toggleFaq(index)}
          >
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Ionicons 
              name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
              size={20} 
              color={Colors.textLight} 
            />
          </TouchableOpacity>
          
          {expandedFaq === index && (
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          )}
        </Card>
      ))}

      <View style={styles.actionButtons}>
        <Button 
          title="专家投注秘诀" 
          variant="outline"
          style={styles.actionButton}
        />
        <Button 
          title="进入赛马百科" 
          variant="primary"
          style={styles.actionButton}
        />
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
  stepperContainer: {
    marginBottom: Layout.spacing.lg,
  },
  stepper: {
    paddingVertical: Layout.spacing.sm,
  },
  stepButton: {
    alignItems: 'center',
    marginRight: Layout.spacing.lg,
    width: 80,
  },
  activeStepButton: {
    
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  activeStepNumber: {
    backgroundColor: Colors.primary,
  },
  stepNumberText: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  activeStepNumberText: {
    color: 'white',
  },
  stepText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  activeStepText: {
    color: Colors.text,
    fontWeight: '600',
  },
  stepCard: {
    marginBottom: Layout.spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  stepTitleContainer: {
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  tipsList: {
    backgroundColor: '#f9f9f9',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.small,
  },
  tipsHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Layout.spacing.sm,
    color: Colors.text,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.lg,
    color: Colors.text,
  },
  demoCard: {
    marginBottom: Layout.spacing.lg,
  },
  demoContainer: {
    padding: Layout.spacing.xs,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  demoInstructions: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: Layout.spacing.md,
  },
  demoHorseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedHorseItem: {
    backgroundColor: '#e6f7ff',
  },
  demoHorseNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  demoHorseNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  demoHorseName: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  demoHorseOdds: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  demoButton: {
    marginTop: Layout.spacing.md,
  },
  demoSelectionSummary: {
    backgroundColor: '#f5f5f5',
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.small,
    marginBottom: Layout.spacing.md,
  },
  demoSummaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: Layout.spacing.sm,
  },
  demoSummaryRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  demoSummaryLabel: {
    width: 70,
    fontSize: 14,
    color: Colors.textLight,
  },
  demoSummaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  amountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  amountButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 2,
    borderRadius: Layout.borderRadius.small,
  },
  amountButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  amountButtonText: {
    color: Colors.text,
  },
  amountButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  returnCalculator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: '#f0f8ff',
    borderRadius: Layout.borderRadius.small,
    marginBottom: Layout.spacing.md,
  },
  returnLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  returnValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  betSummaryCard: {
    marginBottom: Layout.spacing.md,
  },
  betSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  betSummarySection: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.sm,
  },
  betSummaryLabel: {
    width: 80,
    fontSize: 14,
    color: Colors.textLight,
  },
  betSummaryValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  betSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  betSummaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  betSummaryTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.success,
  },
  confirmText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.textLight,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  faqCard: {
    marginBottom: Layout.spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: Layout.spacing.sm,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
});

export default BettingTutorialScreen; 