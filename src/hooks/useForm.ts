import { useState, useCallback } from 'react';

interface FormErrors<T> {
  [key: string]: string;
}

/**
 * 简单的表单状态管理Hook
 */
export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // 当字段值变更时清除该字段的错误
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  const handleBlur = useCallback((name: keyof T) => {
    // 可以在这里添加字段失焦时的验证逻辑
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const validateForm = useCallback((validationSchema?: any) => {
    // 如果提供了验证模式，可以在这里实现验证逻辑
    // 这是一个简单的必填字段验证示例
    const newErrors: FormErrors<T> = {};
    
    Object.keys(values).forEach((key) => {
      if (values[key] === undefined || values[key] === null || values[key] === '') {
        newErrors[key] = '此字段为必填项';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    reset,
    setFieldError,
    setIsSubmitting,
    validateForm,
  };
} 