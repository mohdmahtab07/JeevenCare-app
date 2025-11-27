import { View, Text, TextInput, TextInputProps } from "react-native";
import { Colors } from "@/constants/Colors";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  error,
  containerClassName = "",
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TextInput
        className={`border rounded-xl px-4 py-3 text-base ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholderTextColor={Colors.textSecondary}
        {...props}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}
