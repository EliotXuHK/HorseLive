import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';
import { Ionicons } from '@expo/vector-icons';

// 图表类型
type ChartType = 'oddsChange' | 'oddsTimeline' | 'prediction';

// 模拟赔率历史数据 (每10分钟一个数据点，从1小时前到现在)
const oddsTimelineData = [
  { 
    id: 1, 
    name: '风驰电掣',
    data: [3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2],
  },
  { 
    id: 2, 
    name: '飞黄腾达',
    data: [4.1, 4.2, 4.1, 4.3, 4.0, 4.1, 4.0],
  },
  { 
    id: 3, 
    name: '一日千里',
    data: [5.6, 5.5, 5.4, 5.2, 5.0, 5.3, 5.5],
  },
  { 
    id: 4, 
    name: '龙行天下',
    data: [7.2, 7.3, 7.4, 7.2, 7.0, 7.1, 7.0],
  },
  { 
    id: 5, 
    name: '鹰击长空',
    data: [14.0, 13.5, 12.5, 11.5, 10.5, 11.0, 12.0],
  },
];

// 模拟赔率变化数据 (开盘赔率与当前赔率的差异)
const oddsChangeData = [
  { id: 1, name: '风驰电掣', openingOdds: 4.0, currentOdds: 3.2, change: -20.0 },
  { id: 2, name: '飞黄腾达', openingOdds: 4.2, currentOdds: 4.0, change: -4.8 },
  { id: 3, name: '一日千里', openingOdds: 5.0, currentOdds: 5.5, change: 10.0 },
  { id: 4, name: '龙行天下', openingOdds: 7.5, currentOdds: 7.0, change: -6.7 },
  { id: 5, name: '鹰击长空', openingOdds: 10.0, currentOdds: 12.0, change: 20.0 },
];

// 模拟预测排名数据
const predictionData = [
  { id: 1, name: '风驰电掣', winProbability: 31.25, top3Probability: 75.0, predictedPosition: 1 },
  { id: 2, name: '飞黄腾达', winProbability: 25.0, top3Probability: 68.0, predictedPosition: 2 },
  { id: 3, name: '一日千里', winProbability: 18.18, top3Probability: 60.0, predictedPosition: 3 },
  { id: 4, name: '龙行天下', winProbability: 14.29, top3Probability: 52.0, predictedPosition: 4 },
  { id: 5, name: '鹰击长空', winProbability: 8.33, top3Probability: 35.0, predictedPosition: 5 },
];

const DataAnalysisScreen = () => {
  const [chartType, setChartType] = useState<ChartType>('oddsTimeline');
  const [selectedHorseId, setSelectedHorseId] = useState<number | null>(1);

  // 获取屏幕宽度以计算图表尺寸
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32; // 考虑padding
  const chartHeight = 200;
  
  // 切换图表类型
  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };
  
  // 选择马匹
  const handleSelectHorse = (id: number) => {
    setSelectedHorseId(id);
  };
  
  // 渲染赔率时间线图表
  const renderOddsTimelineChart = () => {
    // 找到当前选中的马匹数据
    const horseData = oddsTimelineData.find(h => h.id === selectedHorseId);
    if (!horseData) return null;
    
    // 计算图表的值范围
    const minValue = Math.min(...horseData.data) * 0.9;
    const maxValue = Math.max(...horseData.data) * 1.1;
    const valueRange = maxValue - minValue;
    
    // 计算绘制点的函数
    const getX = (index: number) => (index / (horseData.data.length - 1)) * chartWidth;
    const getY = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;
    
    // 构建折线图路径
    let pathData = '';
    horseData.data.forEach((value, index) => {
      const x = getX(index);
      const y = getY(value);
      
      if (index === 0) {
        pathData += `M ${x} ${y}`;
      } else {
        pathData += ` L ${x} ${y}`;
      }
    });
    
    // 生成时间标签
    const timeLabels = [];
    for (let i = 0; i < horseData.data.length; i++) {
      const minutesAgo = (horseData.data.length - 1 - i) * 10;
      const label = minutesAgo === 0 ? '现在' : `${minutesAgo}分钟前`;
      timeLabels.push(label);
    }
    
    return (
      <Card elevated style={styles.chartCard}>
        <Text style={styles.chartTitle}>
          {horseData.name} 赔率走势
        </Text>
        
        <View style={styles.timelineChartContainer}>
          <View style={styles.svgContainer}>
            {/* 使用View模拟SVG内容 */}
            <View style={styles.chartYAxis}>
              <Text style={styles.axisLabel}>{maxValue.toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{((maxValue + minValue) / 2).toFixed(1)}</Text>
              <Text style={styles.axisLabel}>{minValue.toFixed(1)}</Text>
            </View>
            
            <View style={styles.chartContent}>
              {/* 水平网格线 */}
              <View style={[styles.gridLine, { top: 0 }]} />
              <View style={[styles.gridLine, { top: chartHeight / 2 }]} />
              <View style={[styles.gridLine, { top: chartHeight }]} />
              
              {/* 使用View模拟折线 */}
              <View style={styles.chartLine}>
                {horseData.data.map((value, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <View 
                        style={[
                          styles.linePath,
                          {
                            left: getX(index - 1),
                            top: getY(horseData.data[index - 1]),
                            width: getX(index) - getX(index - 1),
                            height: Math.abs(getY(value) - getY(horseData.data[index - 1])),
                            transform: [
                              { translateY: Math.min(getY(value), getY(horseData.data[index - 1])) - getY(horseData.data[index - 1]) }
                            ]
                          }
                        ]}
                      />
                    )}
                    <View 
                      style={[
                        styles.dataPoint,
                        { left: getX(index), top: getY(value) }
                      ]}
                    />
                  </React.Fragment>
                ))}
              </View>
              
              {/* 数据点上的值标签 */}
              {horseData.data.map((value, index) => (
                <Text 
                  key={`label-${index}`}
                  style={[
                    styles.dataPointLabel,
                    { left: getX(index), top: getY(value) - 20 }
                  ]}
                >
                  {value.toFixed(1)}
                </Text>
              ))}
            </View>
            
            {/* X轴标签 */}
            <View style={styles.chartXAxis}>
              {timeLabels.map((label, index) => (
                <Text 
                  key={`time-${index}`} 
                  style={[
                    styles.timeLabel,
                    { left: getX(index) }
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>
        
        <Text style={styles.chartDescription}>
          展示赛前60分钟内的赔率变化趋势。明显下降的赔率意味着更多投注和更高的看好度。
        </Text>
      </Card>
    );
  };
  
  // 渲染赔率变化图表
  const renderOddsChangeChart = () => {
    // 对数据按变化幅度排序
    const sortedData = [...oddsChangeData].sort((a, b) => a.change - b.change);
    
    // 计算图表的值范围
    const maxChange = Math.max(...sortedData.map(item => Math.abs(item.change)));
    const barWidth = (chartWidth - 40) / sortedData.length;
    
    return (
      <Card elevated style={styles.chartCard}>
        <Text style={styles.chartTitle}>赔率变化比较 (开盘至今)</Text>
        
        <View style={styles.changeChartContainer}>
          {/* 水平中线 (0% 线) */}
          <View style={styles.zeroLine} />
          
          {/* 绘制柱状图 */}
          {sortedData.map((item, index) => {
            const barHeight = Math.abs(item.change) / maxChange * 150;
            const isNegative = item.change < 0;
            
            return (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: isNegative ? Colors.success : Colors.error,
                      alignSelf: isNegative ? 'flex-end' : 'flex-start',
                    }
                  ]}
                />
                <Text style={styles.barLabel}>{item.name}</Text>
                <Text style={styles.barValue}>
                  {isNegative ? '' : '+'}
                  {item.change.toFixed(1)}%
                </Text>
              </View>
            );
          })}
        </View>
        
        <Text style={styles.chartDescription}>
          对比开盘赔率与当前赔率的变化幅度。向下变化(绿色)表示赔率降低，看好度上升。
        </Text>
      </Card>
    );
  };
  
  // 渲染预测排名图表
  const renderPredictionChart = () => {
    // 对数据按预测排名排序
    const sortedData = [...predictionData].sort((a, b) => a.predictedPosition - b.predictedPosition);
    
    return (
      <Card elevated style={styles.chartCard}>
        <Text style={styles.chartTitle}>预测排名和胜率</Text>
        
        {sortedData.map((item, index) => (
          <View key={index} style={styles.predictionItem}>
            <View style={styles.predictionRank}>
              <Text style={styles.rankNumber}>{item.predictedPosition}</Text>
            </View>
            
            <View style={styles.predictionInfo}>
              <Text style={styles.horseName}>{item.name}</Text>
              
              <View style={styles.probabilitySection}>
                <Text style={styles.probabilityLabel}>夺冠概率:</Text>
                <View style={styles.probabilityBarContainer}>
                  <View 
                    style={[
                      styles.probabilityBar,
                      { width: `${item.winProbability}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.probabilityValue}>{item.winProbability.toFixed(1)}%</Text>
              </View>
              
              <View style={styles.probabilitySection}>
                <Text style={styles.probabilityLabel}>前三概率:</Text>
                <View style={styles.probabilityBarContainer}>
                  <View 
                    style={[
                      styles.probabilityBar,
                      styles.top3Bar,
                      { width: `${item.top3Probability}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.probabilityValue}>{item.top3Probability.toFixed(1)}%</Text>
              </View>
            </View>
          </View>
        ))}
        
        <Text style={styles.chartDescription}>
          基于历史表现和当前赔率的综合分析预测。数据仅供参考，不构成投注建议。
        </Text>
      </Card>
    );
  };
  
  // 渲染马匹选择器
  const renderHorseSelector = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horseSelectorContent}
      >
        {oddsTimelineData.map(horse => (
          <TouchableOpacity
            key={horse.id}
            style={[
              styles.horseButton,
              selectedHorseId === horse.id && styles.selectedHorseButton
            ]}
            onPress={() => handleSelectHorse(horse.id)}
          >
            <Text 
              style={[
                styles.horseButtonText,
                selectedHorseId === horse.id && styles.selectedHorseButtonText
              ]}
            >
              {horse.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  
  // 渲染图表类型选择器
  const renderChartTypeSelector = () => {
    return (
      <View style={styles.chartTypeSelector}>
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'oddsTimeline' && styles.activeChartTypeButton
          ]}
          onPress={() => handleChartTypeChange('oddsTimeline')}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={chartType === 'oddsTimeline' ? Colors.primary : Colors.textLight} 
          />
          <Text 
            style={[
              styles.chartTypeText,
              chartType === 'oddsTimeline' && styles.activeChartTypeText
            ]}
          >
            赔率走势
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'oddsChange' && styles.activeChartTypeButton
          ]}
          onPress={() => handleChartTypeChange('oddsChange')}
        >
          <Ionicons 
            name="bar-chart-outline" 
            size={20} 
            color={chartType === 'oddsChange' ? Colors.primary : Colors.textLight} 
          />
          <Text 
            style={[
              styles.chartTypeText,
              chartType === 'oddsChange' && styles.activeChartTypeText
            ]}
          >
            赔率变化
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.chartTypeButton,
            chartType === 'prediction' && styles.activeChartTypeButton
          ]}
          onPress={() => handleChartTypeChange('prediction')}
        >
          <Ionicons 
            name="podium-outline" 
            size={20} 
            color={chartType === 'prediction' ? Colors.primary : Colors.textLight} 
          />
          <Text 
            style={[
              styles.chartTypeText,
              chartType === 'prediction' && styles.activeChartTypeText
            ]}
          >
            预测排名
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 根据当前选择的图表类型展示相应的图表
  const renderCurrentChart = () => {
    switch (chartType) {
      case 'oddsTimeline':
        return (
          <>
            {renderHorseSelector()}
            {renderOddsTimelineChart()}
          </>
        );
      case 'oddsChange':
        return renderOddsChangeChart();
      case 'prediction':
        return renderPredictionChart();
      default:
        return null;
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Card style={styles.analysisCard}>
        <Text style={styles.analysisTitle}>数据分析</Text>
        <Text style={styles.analysisDescription}>
          通过多维度数据分析，帮助您深入了解赛马赔率变化、趋势和预测。
          切换不同图表类型，获取更全面的赛事洞察。
        </Text>
      </Card>
      
      {renderChartTypeSelector()}
      {renderCurrentChart()}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          数据更新时间: 2025年6月15日 14:30
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Layout.spacing.md,
  },
  analysisCard: {
    marginBottom: Layout.spacing.md,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  analysisDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    backgroundColor: '#f5f5f5',
    borderRadius: Layout.borderRadius.medium,
    padding: 3,
  },
  chartTypeButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
  },
  activeChartTypeButton: {
    backgroundColor: '#e6f7ff',
  },
  chartTypeText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  activeChartTypeText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  horseSelectorContent: {
    paddingBottom: Layout.spacing.sm,
  },
  horseButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    marginRight: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.medium,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedHorseButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  horseButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedHorseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  chartCard: {
    marginBottom: Layout.spacing.lg,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  chartDescription: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginTop: Layout.spacing.md,
    textAlign: 'center',
  },
  timelineChartContainer: {
    height: 250,
    marginTop: Layout.spacing.md,
  },
  svgContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  chartYAxis: {
    width: 30,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: Colors.textLight,
  },
  chartContent: {
    flex: 1,
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  chartLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linePath: {
    position: 'absolute',
    height: 2,
    backgroundColor: Colors.primary,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  dataPointLabel: {
    position: 'absolute',
    fontSize: 10,
    color: Colors.text,
    textAlign: 'center',
    transform: [{ translateX: -10 }],
  },
  chartXAxis: {
    height: 30,
    position: 'relative',
  },
  timeLabel: {
    position: 'absolute',
    fontSize: 10,
    color: Colors.textLight,
    textAlign: 'center',
    top: 5,
    transform: [{ translateX: -15 }],
  },
  changeChartContainer: {
    height: 220,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  zeroLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    top: '50%',
  },
  barContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  bar: {
    width: 20,
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 10,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 5,
    width: 40,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textLight,
    textAlign: 'center',
  },
  predictionItem: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    alignItems: 'center',
  },
  predictionRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  rankNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  predictionInfo: {
    flex: 1,
  },
  horseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 5,
  },
  probabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  probabilityLabel: {
    width: 70,
    fontSize: 12,
    color: Colors.textLight,
  },
  probabilityBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginRight: Layout.spacing.sm,
    overflow: 'hidden',
  },
  probabilityBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  top3Bar: {
    backgroundColor: Colors.secondary,
  },
  probabilityValue: {
    width: 45,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'right',
  },
  footer: {
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});

export default DataAnalysisScreen; 