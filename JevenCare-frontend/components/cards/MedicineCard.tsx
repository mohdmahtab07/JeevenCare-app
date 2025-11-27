import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Medicine } from "@/types";
import { Colors } from "@/constants/Colors";

interface MedicineCardProps {
  medicine: Medicine;
  onPress: () => void;
}

export default function MedicineCard({ medicine, onPress }: MedicineCardProps) {
  const inStock = medicine.stock > 0;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-200"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {medicine.name}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">
            {medicine.genericName}
          </Text>

          <View className="flex-row items-center mt-2">
            <Text className="text-xl font-bold text-green-600">
              ₹{medicine.price}
            </Text>
            <Text className="text-gray-500 text-sm ml-2">per strip</Text>
          </View>

          <View className="flex-row items-center mt-2">
            <View
              className={`px-3 py-1 rounded-full ${inStock ? "bg-green-100" : "bg-red-100"}`}
            >
              <Text
                className={`text-xs font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}
              >
                {inStock ? `${medicine.stock} in stock` : "Out of Stock"}
              </Text>
            </View>
          </View>
        </View>

        <View className="items-center">
          <View className="w-16 h-16 bg-blue-50 rounded-full items-center justify-center mb-2">
            <Ionicons name="medkit" size={32} color={Colors.primary} />
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
