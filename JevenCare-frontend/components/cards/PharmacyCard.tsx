import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pharmacy } from "@/types";
import { Colors } from "@/constants/Colors";

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onPress: () => void;
}

export default function PharmacyCard({ pharmacy, onPress }: PharmacyCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {pharmacy.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="location" size={14} color={Colors.textSecondary} />
            <Text className="text-sm text-gray-600 ml-1 flex-1">
              {pharmacy.address}
            </Text>
          </View>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${pharmacy.isOpen ? "bg-green-100" : "bg-red-100"}`}
        >
          <Text
            className={`text-xs font-semibold ${pharmacy.isOpen ? "text-green-600" : "text-red-600"}`}
          >
            {pharmacy.isOpen ? "Open" : "Closed"}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="call" size={16} color={Colors.primary} />
          <Text className="text-gray-700 ml-2">{pharmacy.phone}</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="medkit" size={16} color={Colors.textSecondary} />
          <Text className="text-gray-600 ml-1">
            {pharmacy.medicines.length} medicines
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
