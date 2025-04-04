import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// 配置Redux存储
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // 添加其他reducer
  },
  // 可选中间件配置
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

// 从store状态推断出类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 