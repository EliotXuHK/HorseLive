import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';

// 使用贯穿整个应用的类型化dispatch钩子
export const useAppDispatch = () => useDispatch<AppDispatch>(); 