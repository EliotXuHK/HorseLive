import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  CartItem, 
  loadCartItems, 
  removeFromCart, 
  markAsWin, 
  clearCart 
} from '../../store/cartSlice';
import { Colors, Layout, Theme } from '../../constants';
import { Card, FloatingButton } from '../../components/common';
import { LinearGradient } from 'expo-linear-gradient';

// 获取投注类型的中文名称
const getBetTypeName = (betType: string): string => {
  switch (betType) {
    case 'win': return '独赢';
    case 'place': return '位置';
    case 'quinella': return '连赢';
    case 'forecast': return '二重彩';
    case 'tierce': return '三重彩';
    default: return '投注';
  }
};

interface CartScreenProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

const CartScreen = ({ navigation }: CartScreenProps) => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);
  const [sortOrder, setSortOrder] = useState<'dateDesc' | 'dateAsc'>('dateDesc');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  
  // 动画值
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  // 加载购物车数据
  useEffect(() => {
    dispatch(loadCartItems() as any);
    
    // 入场动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [dispatch, fadeAnim, slideAnim]);
  
  // 处理投注记录排序
  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return sortOrder === 'dateDesc' ? dateB - dateA : dateA - dateB;
  });
  
  // 切换排序顺序
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'dateDesc' ? 'dateAsc' : 'dateDesc');
  };
  
  // 打开详情模态框
  const openItemDetails = (item: CartItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  
  // 关闭详情模态框
  const closeItemDetails = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };
  
  // 删除投注记录
  const handleRemoveItem = (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这条投注记录吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', onPress: () => dispatch(removeFromCart(id)) }
      ]
    );
  };
  
  // 标记中奖状态
  const handleMarkWinStatus = (id: string, isWin: boolean) => {
    dispatch(markAsWin({ id, isWin }));
    setModalVisible(false);
  };
  
  // 清空购物车
  const handleClearCart = () => {
    Alert.alert(
      '确认清空',
      '确定要清空所有投注记录吗？此操作不可撤销。',
      [
        { text: '取消', style: 'cancel' },
        { text: '清空', onPress: () => dispatch(clearCart()) }
      ]
    );
  };
  
  // 渲染列表项
  const renderItem = ({ item, index }: { item: CartItem, index: number }) => {
    // 为每个项目设置不同的动画延迟
    const itemFadeAnim = React.useRef(new Animated.Value(0)).current;
    const itemSlideAnim = React.useRef(new Animated.Value(50)).current;
    
    React.useEffect(() => {
      // 延迟动画，使列表项逐个出现
      const delay = index * 100;
      
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 400,
          delay,
          useNativeDriver: true,
        })
      ]).start();
    }, []);
    
    return (
      <Animated.View
        style={[
          { 
            opacity: itemFadeAnim, 
            transform: [{ translateY: itemSlideAnim }]
          }
        ]}
      >
        <Card
          elevated="medium"
          borderRadius={Layout.borderRadius.medium}
          style={[styles.itemCard]}
          onPress={() => openItemDetails(item)}
        >
          {/* 中奖标记 */}
          {item.resultChecked && (
            <View style={[
              styles.resultBadge,
              item.isWin ? styles.winBadge : styles.loseBadge
            ]}>
              <Text style={styles.resultBadgeText}>
                {item.isWin ? '已中奖' : '未中奖'}
              </Text>
            </View>
          )}
          
          {/* 赛事信息 */}
          <View style={styles.cardHeader}>
            <Text style={styles.raceInfo}>
              {item.raceName} | {item.raceDate} {item.raceTime}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id)}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          {/* 投注信息 */}
          <View style={styles.betDetails}>
            <Text style={styles.betType}>
              {getBetTypeName(item.betType)}
            </Text>
            <Text style={styles.horseNumbers}>
              马匹: {item.horses.map(h => `${h}号`).join(', ')}
            </Text>
            <View style={styles.oddsContainer}>
              <Text style={styles.oddsLabel}>赔率</Text>
              <Text style={styles.oddsValue}>{item.odds}</Text>
            </View>
          </View>
          
          {/* 底部信息 */}
          <View style={styles.cardFooter}>
            <Text style={styles.amount}>投注: ¥{item.amount.toFixed(2)}</Text>
            <Text style={styles.potentialReturn}>
              可能回报: ¥{(item.amount * item.odds).toFixed(2)}
            </Text>
          </View>
        </Card>
      </Animated.View>
    );
  };
  
  // 渲染详情模态框
  const renderDetailsModal = () => {
    // 动画值
    const modalFadeAnim = React.useRef(new Animated.Value(0)).current;
    const modalScaleAnim = React.useRef(new Animated.Value(0.9)).current;
    
    // 当模态框显示时播放动画
    React.useEffect(() => {
      if (modalVisible) {
        Animated.parallel([
          Animated.timing(modalFadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(modalScaleAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          })
        ]).start();
      } else {
        modalFadeAnim.setValue(0);
        modalScaleAnim.setValue(0.9);
      }
    }, [modalVisible]);
    
    return (
      <Modal
        visible={modalVisible}
        animationType="none" // 我们使用自己的动画
        transparent={true}
        onRequestClose={closeItemDetails}
        statusBarTranslucent={true}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: modalFadeAnim }
          ]}
        >
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                transform: [{ scale: modalScaleAnim }],
                opacity: modalFadeAnim
              }
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeItemDetails}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            
            {selectedItem && (
              <View>
                <Text style={styles.modalTitle}>投注详情</Text>
                
                <View style={styles.detailSection}>
                  <LinearGradient 
                    colors={[Colors.backgroundLight, Colors.backgroundLight, Colors.primary]} 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}} 
                    style={styles.sectionTitleGradient}
                  >
                    <Text style={styles.detailSectionTitle}>赛事信息</Text>
                  </LinearGradient>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>赛事:</Text>
                    <Text style={styles.detailValue}>{selectedItem.raceName}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>日期:</Text>
                    <Text style={styles.detailValue}>{selectedItem.raceDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>时间:</Text>
                    <Text style={styles.detailValue}>{selectedItem.raceTime}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <LinearGradient 
                    colors={[Colors.backgroundLight, Colors.backgroundLight, Colors.primary]} 
                    start={{x: 0, y: 0}} 
                    end={{x: 1, y: 0}} 
                    style={styles.sectionTitleGradient}
                  >
                    <Text style={styles.detailSectionTitle}>投注信息</Text>
                  </LinearGradient>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>类型:</Text>
                    <Text style={styles.detailValue}>
                      {getBetTypeName(selectedItem.betType)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>马匹:</Text>
                    <Text style={styles.detailValue}>
                      {selectedItem.horses.map(h => `${h}号`).join(', ')}
                      {selectedItem.horseNames && ` (${selectedItem.horseNames.join(', ')})`}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>赔率:</Text>
                    <Text style={styles.detailValue}>{selectedItem.odds}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>金额:</Text>
                    <Text style={styles.detailValue}>¥{selectedItem.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>可能回报:</Text>
                    <Text style={[styles.detailValue, styles.returnValue]}>
                      ¥{(selectedItem.amount * selectedItem.odds).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>添加时间:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedItem.dateAdded).toLocaleString()}
                    </Text>
                  </View>
                </View>
                
                {/* 标记中奖状态 */}
                <View style={styles.winStatusContainer}>
                  <Text style={styles.winStatusTitle}>手动标记结果</Text>
                  <View style={styles.winStatusButtons}>
                    <TouchableOpacity
                      style={[
                        styles.winStatusButton,
                        styles.winButton,
                        selectedItem.resultChecked && selectedItem.isWin && styles.activeButton
                      ]}
                      onPress={() => handleMarkWinStatus(selectedItem.id, true)}
                    >
                      <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                      <Text style={[styles.winStatusButtonText, {color: Colors.success}]}>已中奖</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        styles.winStatusButton,
                        styles.loseButton,
                        selectedItem.resultChecked && !selectedItem.isWin && styles.activeButton
                      ]}
                      onPress={() => handleMarkWinStatus(selectedItem.id, false)}
                    >
                      <Ionicons name="close-circle" size={20} color={Colors.error} />
                      <Text style={[styles.winStatusButtonText, {color: Colors.error}]}>未中奖</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>
    );
  };
  
  // 渲染空购物车
  const renderEmptyCart = () => (
    <Animated.View style={[
      styles.emptyContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <Ionicons name="cart-outline" size={80} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>投注购物车为空</Text>
      <Text style={styles.emptySubtitle}>
        您可以在浏览赛马信息时，将心仪的组合添加到购物车
      </Text>
    </Animated.View>
  );
  
  return (
    <SafeAreaView style={Theme.layout.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>投注记录</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={toggleSortOrder}
            >
              <Ionicons 
                name={sortOrder === 'dateDesc' ? 'arrow-down' : 'arrow-up'} 
                size={18} 
                color={Colors.text} 
              />
              <Text style={styles.sortButtonText}>日期</Text>
            </TouchableOpacity>
            
            {items.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearCart}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
                <Text style={styles.clearButtonText}>清空</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={50} color={Colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={sortedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyCart}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        {/* 详情模态框 */}
        {renderDetailsModal()}
        
        {/* 浮动返回按钮 */}
        <FloatingButton
          icon="chevron-back"
          onPress={() => navigation.goBack()}
          bottom={30}
          left={20}
          right={undefined}
          color={Colors.primary}
          gradientColors={Theme.effects.gradients.primary as [string, string]}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Layout.typography.size.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: Colors.backgroundAccent,
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: Layout.typography.size.sm,
    color: Colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: 'rgba(255, 82, 82, 0.15)',
  },
  clearButtonText: {
    marginLeft: 4,
    fontSize: Layout.typography.size.sm,
    color: Colors.error,
  },
  listContent: {
    padding: Layout.spacing.md,
    paddingBottom: Layout.spacing.xxl,
    minHeight: '100%',
  },
  itemCard: {
    marginBottom: Layout.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  winCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  loseCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  resultBadge: {
    position: 'absolute',
    top: 10,
    right: -30,
    width: 120,
    transform: [{ rotate: '45deg' }],
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  winBadge: {
    backgroundColor: Colors.success,
  },
  loseBadge: {
    backgroundColor: Colors.error,
  },
  resultBadgeText: {
    color: '#fff',
    fontSize: Layout.typography.size.xs,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  raceInfo: {
    fontSize: Layout.typography.size.sm,
    color: Colors.textLight,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  betDetails: {
    marginBottom: Layout.spacing.sm,
  },
  betType: {
    fontSize: Layout.typography.size.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  horseNumbers: {
    fontSize: Layout.typography.size.md,
    color: Colors.text,
    marginBottom: 8,
  },
  oddsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oddsLabel: {
    fontSize: Layout.typography.size.sm,
    color: Colors.textLight,
    marginRight: 4,
  },
  oddsValue: {
    fontSize: Layout.typography.size.md,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Layout.spacing.sm,
  },
  amount: {
    fontSize: Layout.typography.size.sm,
    color: Colors.textLight,
  },
  potentialReturn: {
    fontSize: Layout.typography.size.sm,
    fontWeight: 'bold',
    color: Colors.success,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Layout.spacing.sm,
    fontSize: Layout.typography.size.md,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  errorText: {
    marginTop: Layout.spacing.md,
    fontSize: Layout.typography.size.md,
    color: Colors.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyTitle: {
    fontSize: Layout.typography.size.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  emptySubtitle: {
    fontSize: Layout.typography.size.md,
    color: Colors.textLight,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Layout.spacing.lg,
    left: Layout.spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: Colors.backgroundLight,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
    ...Layout.shadows.large,
  },
  closeButton: {
    position: 'absolute',
    top: Layout.spacing.md,
    right: Layout.spacing.md,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: Layout.typography.size.xl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: Layout.spacing.lg,
  },
  detailSectionTitle: {
    fontSize: Layout.typography.size.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    width: 80,
    fontSize: Layout.typography.size.sm,
    color: Colors.textLight,
  },
  detailValue: {
    flex: 1,
    fontSize: Layout.typography.size.sm,
    color: Colors.text,
  },
  returnValue: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  winStatusContainer: {
    marginTop: Layout.spacing.md,
  },
  winStatusTitle: {
    fontSize: Layout.typography.size.md,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  winStatusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  winStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.medium,
    flex: 0.48,
  },
  winButton: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  loseButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  activeButton: {
    opacity: 1,
  },
  winStatusButtonText: {
    marginLeft: 4,
    fontSize: Layout.typography.size.sm,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionTitleGradient: {
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Layout.spacing.sm,
  },
});

export default CartScreen; 