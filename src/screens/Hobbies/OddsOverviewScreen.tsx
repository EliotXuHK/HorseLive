import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../../constants';
import { Card } from '../../components';

// 模拟赛事数据
const raceData = {
  id: 'race-2025-06-15',
  name: '香港国际赛事 - 冠军杯',
  location: '沙田赛马场',
  date: '2025年6月15日',
  time: '15:30',
  status: 'upcoming', // live, upcoming, completed
  distance: '1600m',
};

// 模拟马匹赔率数据
const initialHorsesData = [
  { 
    id: 1, 
    number: 1, 
    name: '风驰电掣', 
    jockey: '莫雷拉',
    winOdds: 3.2, 
    placeOdds: 1.3,
    quinellaOdds: 4.5,
    previousWinOdds: 3.5,
    previousPlaceOdds: 1.4,
    winProbability: 31.25,
    trend: 'up',
    trendPercentage: 8.6,
    highlighted: true,
  },
  { 
    id: 2, 
    number: 2, 
    name: '飞黄腾达', 
    jockey: '薛恩',
    winOdds: 4.0, 
    placeOdds: 1.5,
    quinellaOdds: 5.2,
    previousWinOdds: 4.2,
    previousPlaceOdds: 1.6,
    winProbability: 25.0,
    trend: 'up',
    trendPercentage: 4.8,
    highlighted: false,
  },
  { 
    id: 3, 
    number: 3, 
    name: '一日千里', 
    jockey: '潘顿',
    winOdds: 5.5, 
    placeOdds: 1.8,
    quinellaOdds: 7.0,
    previousWinOdds: 5.0,
    previousPlaceOdds: 1.7,
    winProbability: 18.18,
    trend: 'down',
    trendPercentage: 10.0,
    highlighted: true,
  },
  { 
    id: 4, 
    number: 4, 
    name: '龙行天下', 
    jockey: '巴度',
    winOdds: 7.0, 
    placeOdds: 2.3,
    quinellaOdds: 9.5,
    previousWinOdds: 7.5,
    previousPlaceOdds: 2.5,
    winProbability: 14.29,
    trend: 'up',
    trendPercentage: 6.7,
    highlighted: false,
  },
  { 
    id: 5, 
    number: 5, 
    name: '鹰击长空', 
    jockey: '何澤堯',
    winOdds: 12.0, 
    placeOdds: 3.5,
    quinellaOdds: 15.0,
    previousWinOdds: 10.0,
    previousPlaceOdds: 3.0,
    winProbability: 8.33,
    trend: 'down',
    trendPercentage: 20.0,
    highlighted: true,
  },
  { 
    id: 6, 
    number: 6, 
    name: '金戈铁马', 
    jockey: '郭能',
    winOdds: 9.0, 
    placeOdds: 2.8,
    quinellaOdds: 12.0,
    previousWinOdds: 9.0,
    previousPlaceOdds: 2.8,
    winProbability: 11.11,
    trend: 'stable',
    trendPercentage: 0,
    highlighted: false,
  },
  { 
    id: 7, 
    number: 7, 
    name: '旭日东升', 
    jockey: '田泰安',
    winOdds: 20.0, 
    placeOdds: 5.5,
    quinellaOdds: 25.0,
    previousWinOdds: 18.0,
    previousPlaceOdds: 5.0,
    winProbability: 5.0,
    trend: 'down',
    trendPercentage: 11.1,
    highlighted: false,
  },
  { 
    id: 8, 
    number: 8, 
    name: '势如破竹', 
    jockey: '杜苑欣',
    winOdds: 30.0, 
    placeOdds: 8.0,
    quinellaOdds: 35.0,
    previousWinOdds: 30.0,
    previousPlaceOdds: 8.0,
    winProbability: 3.33,
    trend: 'stable',
    trendPercentage: 0,
    highlighted: false,
  },
];

// 排序类型
type SortType = 'number' | 'winOdds' | 'placeOdds' | 'winProbability';

// 显示类型
type OddsType = 'win' | 'place' | 'quinella';

const OddsOverviewScreen = () => {
  const [horsesData, setHorsesData] = useState(initialHorsesData);
  const [sortType, setSortType] = useState<SortType>('number');
  const [oddsType, setOddsType] = useState<OddsType>('win');
  const [sortAscending, setSortAscending] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));

  // 模拟赔率变化
  useEffect(() => {
    const interval = setInterval(() => {
      setHorsesData((prevData) => {
        // 随机挑选1-3匹马改变赔率
        const updatedData = [...prevData];
        const numberOfChanges = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numberOfChanges; i++) {
          const randomIndex = Math.floor(Math.random() * updatedData.length);
          const horse = updatedData[randomIndex];
          
          // 随机决定赔率上升或下降
          const changeDirection = Math.random() > 0.5 ? 1 : -1;
          const changePercentage = (Math.random() * 0.05 + 0.01) * changeDirection;
          
          const newWinOdds = parseFloat((horse.winOdds * (1 + changePercentage)).toFixed(1));
          const newPlaceOdds = parseFloat((horse.placeOdds * (1 + changePercentage * 0.7)).toFixed(1));
          
          updatedData[randomIndex] = {
            ...horse,
            previousWinOdds: horse.winOdds,
            previousPlaceOdds: horse.placeOdds,
            winOdds: newWinOdds,
            placeOdds: newPlaceOdds,
            winProbability: parseFloat((100 / newWinOdds).toFixed(2)),
            trend: changeDirection > 0 ? 'down' : 'up',
            trendPercentage: parseFloat((Math.abs(changePercentage) * 100).toFixed(1)),
            highlighted: Math.abs(changePercentage) > 0.03, // 变化较大时高亮显示
          };
        }
        
        // 排序
        return sortHorses(updatedData, sortType, sortAscending);
      });
      
      // 执行缩放动画
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      
    }, 5000); // 每5秒更新一次
    
    return () => clearInterval(interval);
  }, [sortType, sortAscending]);
  
  // 处理排序
  const sortHorses = (horses: typeof initialHorsesData, type: SortType, ascending: boolean) => {
    return [...horses].sort((a, b) => {
      let compareA, compareB;
      
      switch (type) {
        case 'number':
          compareA = a.number;
          compareB = b.number;
          break;
        case 'winOdds':
          compareA = a.winOdds;
          compareB = b.winOdds;
          break;
        case 'placeOdds':
          compareA = a.placeOdds;
          compareB = b.placeOdds;
          break;
        case 'winProbability':
          compareA = a.winProbability;
          compareB = b.winProbability;
          break;
        default:
          compareA = a.number;
          compareB = b.number;
      }
      
      return ascending ? compareA - compareB : compareB - compareA;
    });
  };
  
  // 切换排序
  const handleSort = (type: SortType) => {
    if (sortType === type) {
      // 如果已经是同一排序类型，切换升降序
      setSortAscending(!sortAscending);
    } else {
      // 否则切换排序类型，默认升序
      setSortType(type);
      setSortAscending(true);
    }
    
    // 对当前数据进行排序
    setHorsesData(prevData => sortHorses(prevData, type, sortType === type ? !sortAscending : true));
  };
  
  // 切换赔率类型
  const handleOddsTypeChange = (type: OddsType) => {
    setOddsType(type);
  };
  
  // 获取当前赔率值
  const getCurrentOdds = (horse: typeof initialHorsesData[0]) => {
    switch (oddsType) {
      case 'win':
        return horse.winOdds;
      case 'place':
        return horse.placeOdds;
      case 'quinella':
        return horse.quinellaOdds;
      default:
        return horse.winOdds;
    }
  };
  
  // 获取前一次赔率值
  const getPreviousOdds = (horse: typeof initialHorsesData[0]) => {
    switch (oddsType) {
      case 'win':
        return horse.previousWinOdds;
      case 'place':
        return horse.previousPlaceOdds;
      default:
        return horse.previousWinOdds;
    }
  };
  
  // 获取赔率类型标题
  const getOddsTypeTitle = () => {
    switch (oddsType) {
      case 'win':
        return '独赢赔率';
      case 'place':
        return '位置赔率';
      case 'quinella':
        return '连赢赔率';
      default:
        return '赔率';
    }
  };
  
  // 渲染趋势图标
  const renderTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'stable') {
      return (
        <View style={styles.trendIconContainer}>
          <Ionicons name="remove" size={16} color={Colors.textLight} />
        </View>
      );
    }
    
    return (
      <View style={[
        styles.trendIconContainer, 
        trend === 'up' ? styles.upTrendContainer : styles.downTrendContainer
      ]}>
        <Ionicons 
          name={trend === 'up' ? 'arrow-up' : 'arrow-down'} 
          size={14} 
          color="white" 
        />
        <Text style={styles.trendPercentageText}>{percentage}%</Text>
      </View>
    );
  };
  
  // 渲染胜率进度条
  const renderProbabilityBar = (probability: number) => {
    return (
      <View style={styles.probabilityContainer}>
        <View style={styles.probabilityBarBackground}>
          <View 
            style={[
              styles.probabilityBarFill, 
              { width: `${Math.min(probability * 2.5, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.probabilityText}>{probability}%</Text>
      </View>
    );
  };

  // 渲染UI组件
  const renderSortButton = (type: SortType, label: string) => {
    const isActive = sortType === type;
    return (
      <TouchableOpacity 
        style={[styles.sortButton, isActive && styles.activeSortButton]} 
        onPress={() => handleSort(type)}
      >
        <Text style={[styles.sortButtonText, isActive && styles.activeSortButtonText]}>
          {label}
          {isActive && (sortAscending ? ' ↑' : ' ↓')}
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderOddsTypeButton = (type: OddsType, label: string) => {
    const isActive = oddsType === type;
    return (
      <TouchableOpacity 
        style={[styles.oddsTypeButton, isActive && styles.activeOddsTypeButton]} 
        onPress={() => handleOddsTypeChange(type)}
      >
        <Text style={[styles.oddsTypeButtonText, isActive && styles.activeOddsTypeButtonText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // 渲染列表项
  const renderItem = ({ item }: { item: typeof initialHorsesData[0] }) => {
    const currentOdds = getCurrentOdds(item);
    const previousOdds = getPreviousOdds(item);
    const isOddsChanged = currentOdds !== previousOdds;
    
    return (
      <Animated.View 
        style={[
          styles.horseItem, 
          item.highlighted && styles.highlightedHorseItem,
          isOddsChanged && { transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.horseNumberContainer}>
          <Text style={styles.horseNumber}>{item.number}</Text>
        </View>
        
        <View style={styles.horseInfoContainer}>
          <Text style={styles.horseName}>{item.name}</Text>
          <Text style={styles.horseJockey}>骑师: {item.jockey}</Text>
        </View>
        
        <View style={styles.oddsContainer}>
          <View style={styles.oddsValueContainer}>
            <Text style={styles.oddsValue}>{currentOdds}</Text>
            {renderTrendIcon(item.trend, item.trendPercentage)}
          </View>
          {renderProbabilityBar(item.winProbability)}
        </View>
      </Animated.View>
    );
  };
  
  // 列表分隔线
  const renderSeparator = () => <View style={styles.separator} />;
  
  // 列表头部
  const renderHeader = () => (
    <View>
      <Card elevated style={styles.raceInfoCard}>
        <Text style={styles.raceName}>{raceData.name}</Text>
        <View style={styles.raceDetailsContainer}>
          <View style={styles.raceDetail}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{raceData.date}</Text>
          </View>
          <View style={styles.raceDetail}>
            <Ionicons name="time-outline" size={16} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{raceData.time}</Text>
          </View>
          <View style={styles.raceDetail}>
            <Ionicons name="location-outline" size={16} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{raceData.location}</Text>
          </View>
          <View style={styles.raceDetail}>
            <Ionicons name="resize-outline" size={16} color={Colors.primary} />
            <Text style={styles.raceDetailText}>{raceData.distance}</Text>
          </View>
        </View>
      </Card>
      
      {/* 显示的赔率类型选择器 */}
      <View style={styles.oddsTypeSelector}>
        {renderOddsTypeButton('win', '独赢')}
        {renderOddsTypeButton('place', '位置')}
        {renderOddsTypeButton('quinella', '连赢')}
      </View>
      
      {/* 排序按钮 */}
      <View style={styles.sortButtonsContainer}>
        <Text style={styles.sortByText}>排序方式: </Text>
        {renderSortButton('number', '马号')}
        {renderSortButton('winOdds', '赔率')}
        {renderSortButton('winProbability', '胜率')}
      </View>
      
      {/* 列表标题 */}
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderText}>马匹</Text>
        <Text style={styles.listHeaderText}>{getOddsTypeTitle()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={horsesData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Layout.spacing.md,
  },
  raceInfoCard: {
    marginBottom: Layout.spacing.md,
  },
  raceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  raceDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  raceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
  },
  raceDetailText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  oddsTypeSelector: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    backgroundColor: '#f5f5f5',
    borderRadius: Layout.borderRadius.medium,
    padding: 3,
  },
  oddsTypeButton: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.small,
  },
  activeOddsTypeButton: {
    backgroundColor: Colors.primary,
  },
  oddsTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  activeOddsTypeButtonText: {
    color: 'white',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sortByText: {
    fontSize: 14,
    color: Colors.textLight,
    marginRight: Layout.spacing.sm,
  },
  sortButton: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 6,
    marginRight: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeSortButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 13,
    color: Colors.text,
  },
  activeSortButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
  listHeaderText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textLight,
  },
  horseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.background,
  },
  highlightedHorseItem: {
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
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
  horseInfoContainer: {
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  horseName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  horseJockey: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  oddsContainer: {
    alignItems: 'center',
    width: 110,
  },
  oddsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  oddsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: Layout.spacing.xs,
  },
  trendIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
  upTrendContainer: {
    backgroundColor: Colors.success,
  },
  downTrendContainer: {
    backgroundColor: Colors.error,
  },
  trendPercentageText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 2,
  },
  probabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  probabilityBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginRight: Layout.spacing.xs,
    overflow: 'hidden',
  },
  probabilityBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  probabilityText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textLight,
    width: 36,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Layout.spacing.xs,
  },
});

export default OddsOverviewScreen; 