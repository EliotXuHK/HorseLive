import { useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store';

// 使用贯穿整个应用的类型化selector钩子
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 