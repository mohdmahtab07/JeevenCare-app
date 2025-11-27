import { Text, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  className = '' 
}: ButtonProps) {
  
  const baseClasses = "rounded-xl py-4 px-6 flex-row items-center justify-center";
  
  const variantClasses = {
    primary: "bg-blue-600",
    secondary: "bg-green-500",
    outline: "bg-white border-2 border-blue-600"
  };

  const textClasses = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-blue-600"
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : '#fff'} />
      ) : (
        <Text className={`${textClasses[variant]} text-base font-semibold`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
