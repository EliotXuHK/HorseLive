import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// 配置全局store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // 这里可以添加其他reducer
  },
});

// 从store中导出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 