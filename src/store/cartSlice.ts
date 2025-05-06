import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 投注类型定义
export type BetType = 'win' | 'place' | 'quinella' | 'forecast' | 'tierce';

// 购物车项目类型
export interface CartItem {
  id: string; // 唯一标识符
  raceId: string; // 赛事ID
  raceName: string; // 赛事名称
  raceDate: string; // 赛事日期
  raceTime: string; // 赛事时间
  betType: BetType; // 投注类型
  horses: number[]; // 马匹号码数组
  horseNames?: string[]; // 马匹名称数组（可选）
  odds: number; // 当时赔率
  amount: number; // 投注金额
  dateAdded: string; // 添加日期
  isWin?: boolean; // 是否中奖（用户标记）
  resultChecked?: boolean; // 是否已检查结果
}

// 购物车状态类型
interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// 创建购物车切片
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 添加投注组合到购物车
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      // 保存到本地存储
      saveCartItems(state.items);
    },
    
    // 从购物车移除项目
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // 保存到本地存储
      saveCartItems(state.items);
    },
    
    // 设置购物车项目中奖状态
    markAsWin: (state, action: PayloadAction<{ id: string; isWin: boolean }>) => {
      const { id, isWin } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.isWin = isWin;
        item.resultChecked = true;
      }
      // 保存到本地存储
      saveCartItems(state.items);
    },
    
    // 清空购物车
    clearCart: (state) => {
      state.items = [];
      // 清除本地存储
      saveCartItems([]);
    },
    
    // 设置购物车数据（从本地存储加载时使用）
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // 设置错误信息
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// 保存购物车到AsyncStorage的辅助函数
const saveCartItems = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem('cart_items', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
};

// 导出actions
export const {
  addToCart,
  removeFromCart,
  markAsWin,
  clearCart,
  setCartItems,
  setLoading,
  setError,
} = cartSlice.actions;

// 导出reducer
export default cartSlice.reducer;

// 加载购物车数据的thunk函数
export const loadCartItems = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const storedItems = await AsyncStorage.getItem('cart_items');
    if (storedItems) {
      dispatch(setCartItems(JSON.parse(storedItems)));
    }
    dispatch(setError(null));
  } catch (error) {
    console.error('Error loading cart items:', error);
    dispatch(setError('Failed to load saved bets'));
  } finally {
    dispatch(setLoading(false));
  }
}; 