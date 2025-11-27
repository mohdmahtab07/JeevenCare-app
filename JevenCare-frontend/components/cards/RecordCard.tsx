import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HealthRecord } from "@/types";
import { Colors } from "@/constants/Colors";

interface RecordCardProps {
  record: HealthRecord;
  onPress: () => void;
}

export default function RecordCard({ record, onPress }: RecordCardProps) {
  const getIcon = () => {
    switch (record.type) {
      case "prescription":
        return "medical";
      case "lab_report":
        return "flask";
      case "visit_summary":
        return "document-text";
      default:
        return "document";
    }
  };

  const getColor = () => {
    switch (record.type) {
      case "prescription":
        return "#2563eb";
      case "lab_report":
        return "#10b981";
      case "visit_summary":
        return "#f59e0b";
      default:
        return Colors.textSecondary;
    }
  };

  const formatType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: getColor() + "20" }}
        >
          <Ionicons name={getIcon() as any} size={24} color={getColor()} />
        </View>

        <View className="flex-1 ml-4">
          <Text className="text-base font-bold text-gray-800">
            {record.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {formatType(record.type)}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons
              name="calendar-outline"
              size={12}
              color={Colors.textSecondary}
            />
            <Text className="text-xs text-gray-500 ml-1">
              {new Date(record.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {record.fileUrl && (
          <View className="bg-blue-50 p-2 rounded-full">
            <Ionicons name="download" size={18} color={Colors.primary} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
