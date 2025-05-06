import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Vibration,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, Theme } from '../../constants';
import { Card } from '../../components/common';
import { LinearGradient } from 'expo-linear-gradient';

// 使用窗口宽度计算赛道宽度
const windowWidth = Dimensions.get('window').width;
const TRACK_WIDTH = windowWidth - (Layout.spacing.md * 2);
const HORSE_SIZE = 36;

// 实时赛马数据类型
interface LiveHorse {
  id: number;
  number: number;
  name: string;
  position: number; // 0-100 表示完成比赛的百分比
  rank: number; // 当前排名
  color: string; // 赛马颜色
}

// 比赛数据类型
interface RaceData {
  id: string;
  name: string;
  status: 'live' | 'upcoming' | 'completed';
  isLive: boolean;
  timeToStart: number;
  // 其他属性...
}

interface LiveRaceScreenProps {
  route: {
    params?: {
      raceData: RaceData;
    };
  };
}

const LiveRaceScreen = ({ route }: LiveRaceScreenProps) => {
  const { raceData } = route.params || {
    raceData: {
      id: 'race-123',
      name: '沙田马场 - 短途锦标赛',
      status: 'upcoming',
      isLive: false,
      timeToStart: 30,
    }
  };
  
  // 动画值
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;
  const cheeringIntensity = React.useRef(new Animated.Value(0)).current;
  
  // 状态
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [isRaceFinished, setIsRaceFinished] = useState(false);
  const [showCheeringEffect, setShowCheeringEffect] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [isCheering, setIsCheering] = useState(false);
  
  // 模拟赛马数据
  const [horses, setHorses] = useState<LiveHorse[]>([
    { id: 1, number: 1, name: '风驰电掣', position: 0, rank: 1, color: '#E53935' },
    { id: 2, number: 2, name: '飞黄腾达', position: 0, rank: 2, color: '#1E88E5' },
    { id: 3, number: 3, name: '一日千里', position: 0, rank: 3, color: '#43A047' },
    { id: 4, number: 4, name: '龙行天下', position: 0, rank: 4, color: '#FDD835' },
    { id: 5, number: 5, name: '鹰击长空', position: 0, rank: 5, color: '#8E24AA' },
    { id: 6, number: 6, name: '金戈铁马', position: 0, rank: 6, color: '#FB8C00' },
  ]);
  
  // 监听比赛状态
  useEffect(() => {
    if (raceData.isLive && !isRaceStarted) {
      // 延迟2秒后开始比赛
      const startTimer = setTimeout(() => {
        startRace();
      }, 2000);
      
      return () => clearTimeout(startTimer);
    }
  }, [raceData.isLive]);
  
  // 开始比赛
  const startRace = () => {
    setIsRaceStarted(true);
    
    // 每100ms更新赛马位置
    const raceInterval = setInterval(() => {
      setHorses(prevHorses => {
        // 如果任何一匹马到达终点，结束比赛
        if (prevHorses.some(horse => horse.position >= 100)) {
          clearInterval(raceInterval);
          setIsRaceFinished(true);
          return calculateFinalRanks(prevHorses);
        }
        
        // 随机更新各赛马位置
        const updatedHorses = prevHorses.map(horse => ({
          ...horse,
          position: Math.min(100, horse.position + Math.random() * 1.5),
        }));
        
        // 重新计算排名
        return calculateRanks(updatedHorses);
      });
    }, 100);
    
    return () => clearInterval(raceInterval);
  };
  
  // 计算赛马排名
  const calculateRanks = (horseList: LiveHorse[]): LiveHorse[] => {
    // 按位置排序
    const sortedHorses = [...horseList].sort((a, b) => b.position - a.position);
    
    // 更新排名
    return sortedHorses.map((horse, index) => ({
      ...horse,
      rank: index + 1
    }));
  };
  
  // 计算最终排名
  const calculateFinalRanks = (horseList: LiveHorse[]): LiveHorse[] => {
    // 统一所有已完成赛马的位置为100
    const updatedHorses = horseList.map(horse => ({
      ...horse,
      position: horse.position >= 100 ? 100 : horse.position
    }));
    
    // 计算排名
    return calculateRanks(updatedHorses);
  };
  
  // 摇一摇加油
  const handleShakeCheer = () => {
    if (isCheering || !isRaceStarted || isRaceFinished) return;
    
    setIsCheering(true);
    setShowCheeringEffect(true);
    
    // 震动反馈
    Vibration.vibrate(500);
    
    // 摇晃动画
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 5,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -5,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    // 欢呼效果动画
    Animated.timing(cheeringIntensity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      // 结束后重置状态
      setTimeout(() => {
        setShowCheeringEffect(false);
        setIsCheering(false);
        cheeringIntensity.setValue(0);
      }, 1000);
    });
    
    // 如果有选中的马匹，提升其速度
    if (selectedHorse !== null) {
      setHorses(prevHorses => 
        prevHorses.map(horse => 
          horse.number === selectedHorse
            ? { ...horse, position: Math.min(100, horse.position + 1.5) }
            : horse
        )
      );
    }
  };
  
  // 选择支持的马匹
  const handleSelectHorse = (horseNumber: number) => {
    setSelectedHorse(selectedHorse === horseNumber ? null : horseNumber);
  };
  
  // 渲染赛马道
  const renderRaceTrack = () => (
    <View style={styles.trackContainer}>
      {/* 赛道背景 */}
      <LinearGradient
        colors={['#2E7D32', '#1B5E20']}
        style={styles.track}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* 赛道线条 */}
        <View style={styles.trackLines}>
          {Array.from({ length: 6 }).map((_, index) => (
            <View key={index} style={styles.trackLine} />
          ))}
        </View>
        
        {/* 起跑线 */}
        <View style={styles.startLine}>
          <Text style={styles.startLineText}>起点</Text>
        </View>
        
        {/* 终点线 */}
        <View style={styles.finishLine}>
          <Text style={styles.finishLineText}>终点</Text>
        </View>
        
        {/* 赛马位置 */}
        {horses.map((horse) => (
          <Animated.View
            key={horse.id}
            style={[
              styles.horseMarker,
              {
                left: `${horse.position}%`,
                backgroundColor: horse.color,
                transform: [
                  { translateX: -HORSE_SIZE / 2 }, // 中心对齐
                  { translateY: (horse.id - 1) * (HORSE_SIZE + 10) }, // 垂直位置
                  { scale: selectedHorse === horse.number ? 1.2 : 1 } // 选中缩放
                ]
              }
            ]}
          >
            <Text style={styles.horseNumber}>{horse.number}</Text>
          </Animated.View>
        ))}
      </LinearGradient>
      
      {/* 欢呼效果 */}
      {showCheeringEffect && (
        <Animated.View 
          style={[
            styles.cheerEffect,
            {
              opacity: cheeringIntensity,
              transform: [{ scale: cheeringIntensity.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.5]
              })}]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255,215,0,0.8)', 'rgba(255,140,0,0.8)']}
            style={styles.cheerEffectGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cheerText}>加油!</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
  
  // 渲染赛事信息面板
  const renderRacePanel = () => (
    <Card style={styles.racePanel}>
      <View style={styles.racePanelHeader}>
        <Text style={styles.racePanelTitle}>
          {isRaceStarted ? '赛事进行中' : '比赛即将开始'}
        </Text>
        {!isRaceStarted && (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
      </View>
      
      {isRaceFinished ? (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>比赛结果</Text>
          {horses.slice(0, 3).map((horse) => (
            <View key={horse.id} style={styles.resultItem}>
              <View style={[styles.rankBadge, getRankBadgeStyle(horse.rank)]}>
                <Text style={styles.rankText}>{horse.rank}</Text>
              </View>
              <Text style={styles.resultHorseName}>{horse.name}</Text>
              <View style={[styles.horseColorDot, { backgroundColor: horse.color }]} />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.liveContainer}>
          <Text style={styles.liveText}>
            {isRaceStarted ? '实时排名' : '准备开始'}
          </Text>
          {horses.map((horse) => (
            <TouchableOpacity
              key={horse.id}
              style={[
                styles.liveHorseItem,
                selectedHorse === horse.number && styles.selectedHorseItem
              ]}
              onPress={() => handleSelectHorse(horse.number)}
              disabled={!isRaceStarted || isRaceFinished}
            >
              <View style={[styles.rankBadge, getRankBadgeStyle(horse.rank)]}>
                <Text style={styles.rankText}>{horse.rank}</Text>
              </View>
              <Text style={styles.liveHorseName}>{horse.name}</Text>
              <View style={styles.horseProgress}>
                <View 
                  style={[
                    styles.horseProgressBar, 
                    { 
                      width: `${horse.position}%`,
                      backgroundColor: horse.color
                    }
                  ]} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      {isRaceStarted && !isRaceFinished && (
        <Animated.View 
          style={[
            styles.cheerButton,
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.cheerButtonInner,
              isCheering && styles.cheeringButton
            ]}
            onPress={handleShakeCheer}
            disabled={isCheering}
          >
            <Ionicons name="pulse" size={24} color="#fff" />
            <Text style={styles.cheerButtonText}>
              {selectedHorse ? `为${selectedHorse}号马加油!` : '摇一摇加油!'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Card>
  );
  
  // 获取排名徽章样式
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1: return styles.firstRank;
      case 2: return styles.secondRank;
      case 3: return styles.thirdRank;
      default: return styles.otherRank;
    }
  };
  
  // 渲染比赛未开始或等待状态
  const renderWaitingState = () => (
    <View style={styles.waitingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.waitingText}>
        {raceData.isLive ? '比赛准备中...' : `距离开赛还有 ${raceData.timeToStart} 秒`}
      </Text>
      <Text style={styles.waitingSubtext}>
        {raceData.isLive ? '直播即将开始' : '请稍候，或先查看赛前信息'}
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {(raceData.isLive || isRaceStarted) ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderRaceTrack()}
          {renderRacePanel()}
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {selectedHorse 
                ? `您正在为${selectedHorse}号马助威！摇晃手机为它加油！`
                : '选择一匹马匹并摇晃手机为它加油！'
              }
            </Text>
          </View>
        </ScrollView>
      ) : (
        renderWaitingState()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // 赛道样式
  trackContainer: {
    margin: Layout.spacing.md,
    height: 300,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: Layout.borderRadius.medium,
    ...Layout.shadows.medium,
  },
  track: {
    flex: 1,
    position: 'relative',
  },
  trackLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-evenly',
  },
  trackLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  startLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  startLineText: {
    position: 'absolute',
    top: 5,
    transform: [{ rotate: '90deg' }],
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  finishLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  finishLineText: {
    position: 'absolute',
    top: 5,
    transform: [{ rotate: '90deg' }],
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  horseMarker: {
    position: 'absolute',
    width: HORSE_SIZE,
    height: HORSE_SIZE,
    borderRadius: HORSE_SIZE / 2,
    top: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  horseNumber: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // 欢呼效果
  cheerEffect: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cheerEffectGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...Layout.shadows.large,
  },
  cheerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
  },
  // 比赛面板
  racePanel: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.md,
  },
  racePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  racePanelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  liveContainer: {
    marginBottom: Layout.spacing.md,
  },
  liveText: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: Layout.spacing.sm,
  },
  liveHorseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAccent,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    marginBottom: Layout.spacing.xs,
  },
  selectedHorseItem: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  liveHorseName: {
    fontSize: 14,
    color: Colors.text,
    width: 80,
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.sm,
  },
  firstRank: {
    backgroundColor: '#FFD700',
  },
  secondRank: {
    backgroundColor: '#C0C0C0',
  },
  thirdRank: {
    backgroundColor: '#CD7F32',
  },
  otherRank: {
    backgroundColor: Colors.backgroundLight,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  horseProgress: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  horseProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  horseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: Layout.spacing.sm,
  },
  // 结果显示
  resultsContainer: {
    marginBottom: Layout.spacing.md,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.sm,
    backgroundColor: Colors.backgroundAccent,
    borderRadius: Layout.borderRadius.small,
    marginBottom: Layout.spacing.xs,
  },
  resultHorseName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  // 加油按钮
  cheerButton: {
    marginTop: Layout.spacing.md,
  },
  cheerButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
  },
  cheeringButton: {
    backgroundColor: Colors.secondary,
  },
  cheerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: Layout.spacing.sm,
  },
  // 等待状态
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  waitingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  waitingSubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
  // 指导文本
  instructionContainer: {
    marginHorizontal: Layout.spacing.md,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: 'rgba(0, 178, 255, 0.1)',
    borderRadius: Layout.borderRadius.medium,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  }
});

export default LiveRaceScreen; 