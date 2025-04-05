import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';
import { Ionicons } from '@expo/vector-icons';

// 模拟投注类型
type BetType = 'win' | 'place' | 'quinella' | 'forecast' | 'tierce';

// 模拟投注组合
interface BetCombination {
  id: string;
  horses: number[];
  betType: BetType;
  amount: number;
  potentialReturn: number;
  risk: 'low' | 'medium' | 'high';
}

// 模拟投注组合数据
const initialBetCombinations: BetCombination[] = [
  {
    id: 'bet-1',
    horses: [1],
    betType: 'win',
    amount: 100,
    potentialReturn: 320,
    risk: 'low',
  },
  {
    id: 'bet-2',
    horses: [1, 2],
    betType: 'quinella',
    amount: 100,
    potentialReturn: 450,
    risk: 'medium',
  },
  {
    id: 'bet-3',
    horses: [1, 2, 3],
    betType: 'tierce',
    amount: 50,
    potentialReturn: 950,
    risk: 'high',
  },
];

const BettingCartScreen = () => {
  const [betCombinations, setBetCombinations] = useState<BetCombination[]>(initialBetCombinations);
  const [totalAmount, setTotalAmount] = useState(() => 
    initialBetCombinations.reduce((sum, bet) => sum + bet.amount, 0)
  );
  const [potentialReturn, setPotentialReturn] = useState(() => 
    initialBetCombinations.reduce((sum, bet) => sum + bet.potentialReturn, 0)
  );

  // 获取投注类型名称
  const getBetTypeName = (type: BetType): string => {
    switch (type) {
      case 'win': return '独赢';
      case 'place': return '位置';
      case 'quinella': return '连赢';
      case 'forecast': return '二重彩';
      case 'tierce': return '三重彩';
      default: return '投注';
    }
  };
  
  // 获取风险等级样式和标签
  const getRiskDetails = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return { color: Colors.success, label: '低风险' };
      case 'medium':
        return { color: Colors.warning, label: '中风险' };
      case 'high':
        return { color: Colors.error, label: '高风险' };
      default:
        return { color: Colors.success, label: '低风险' };
    }
  };
  
  // 格式化马匹号码
  const formatHorseNumbers = (horses: number[]): string => {
    if (horses.length === 1) {
      return `${horses[0]}号`;
    }
    return horses.map(num => `${num}号`).join(', ');
  };
  
  // 移除投注组合
  const removeBetCombination = (id: string) => {
    Alert.alert(
      '确认删除',
      '您确定要从投注组合中删除此项吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            const updatedCombinations = betCombinations.filter(bet => bet.id !== id);
            setBetCombinations(updatedCombinations);
            
            // 更新总金额和潜在回报
            const newTotal = updatedCombinations.reduce((sum, bet) => sum + bet.amount, 0);
            const newReturn = updatedCombinations.reduce((sum, bet) => sum + bet.potentialReturn, 0);
            setTotalAmount(newTotal);
            setPotentialReturn(newReturn);
          }
        }
      ]
    );
  };
  
  // 提交投注
  const submitBets = () => {
    Alert.alert(
      '确认投注',
      `您确定要提交总计 ${totalAmount} 元的投注吗？`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确认', 
          onPress: () => {
            Alert.alert('投注成功', '您的投注已成功提交！');
            // 在实际应用中，这里应该调用API提交投注
          }
        }
      ]
    );
  };
  
  // 渲染投注组合项
  const renderBetItem = (bet: BetCombination) => {
    const riskDetails = getRiskDetails(bet.risk);
    
    return (
      <Card key={bet.id} style={styles.betCard}>
        <View style={styles.betHeader}>
          <View style={styles.betTypeContainer}>
            <Text style={styles.betType}>{getBetTypeName(bet.betType)}</Text>
          </View>
          <View style={[styles.riskBadge, { backgroundColor: riskDetails.color }]}>
            <Text style={styles.riskText}>{riskDetails.label}</Text>
          </View>
        </View>
        
        <View style={styles.betDetails}>
          <Text style={styles.betLabel}>投注马匹:</Text>
          <Text style={styles.betValue}>{formatHorseNumbers(bet.horses)}</Text>
        </View>
        
        <View style={styles.betDetails}>
          <Text style={styles.betLabel}>投注金额:</Text>
          <Text style={styles.betValue}>{bet.amount} 元</Text>
        </View>
        
        <View style={styles.betDetails}>
          <Text style={styles.betLabel}>潜在回报:</Text>
          <Text style={[styles.betValue, styles.returnValue]}>{bet.potentialReturn} 元</Text>
        </View>
        
        <View style={styles.betActions}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeBetCombination(bet.id)}
          >
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
            <Text style={styles.removeButtonText}>删除</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>投注组合汇总</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>投注项目</Text>
              <Text style={styles.summaryValue}>{betCombinations.length}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>总投注额</Text>
              <Text style={styles.summaryValue}>{totalAmount} 元</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>潜在回报</Text>
              <Text style={[styles.summaryValue, styles.returnValue]}>{potentialReturn} 元</Text>
            </View>
          </View>
        </Card>
        
        <Text style={styles.sectionTitle}>投注详情</Text>
        
        {betCombinations.length > 0 ? (
          betCombinations.map(renderBetItem)
        ) : (
          <Card style={styles.emptyCard}>
            <Ionicons name="cart-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyText}>您的投注组合为空</Text>
            <Text style={styles.emptySubtext}>请添加投注组合</Text>
          </Card>
        )}
      </ScrollView>
      
      {betCombinations.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={submitBets}
          >
            <Text style={styles.submitButtonText}>确认投注</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Layout.spacing.md,
    paddingBottom: 80, // 为底部操作栏留出空间
  },
  summaryCard: {
    marginBottom: Layout.spacing.md,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  returnValue: {
    color: Colors.success,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  betCard: {
    marginBottom: Layout.spacing.md,
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  betTypeContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.small,
  },
  betType: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  riskBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.small,
  },
  riskText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  betDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xs,
  },
  betLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  betValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  betActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Layout.spacing.sm,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
  },
  removeButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.error,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: Layout.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: Layout.spacing.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BettingCartScreen; 