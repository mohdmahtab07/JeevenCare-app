import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  languages: string[];
  consultationFee: number;
  profileImage?: string;
  rating?: number;
}

interface DoctorCardProps {
  doctor: Doctor;
  onPress: () => void;
}

export default function DoctorCard({ doctor, onPress }: DoctorCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 border border-gray-200"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* Doctor Image */}
        <Image
          source={{ uri: doctor.profileImage || "https://i.pravatar.cc/150" }}
          className="w-20 h-20 rounded-xl"
        />

        {/* Doctor Info */}
        <View className="flex-1 ml-4">
          <Text className="text-lg font-bold text-gray-800">{doctor.name}</Text>
          <Text className="text-sm text-gray-600 mt-1">
            {doctor.specialization}
          </Text>

          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text className="text-xs text-gray-600 ml-1">
              {doctor.rating ? `${doctor.rating.toFixed(1)} • ` : ""}
              {doctor.experience} years exp.
            </Text>
          </View>

          {doctor.languages && doctor.languages.length > 0 && (
            <View className="flex-row items-center mt-1">
              <Ionicons
                name="language"
                size={14}
                color={Colors.textSecondary}
              />
              <Text className="text-xs text-gray-600 ml-1">
                {doctor.languages.join(", ")}
              </Text>
            </View>
          )}
        </View>

        {/* Consultation Fee */}
        <View className="items-end justify-between">
          <View className="bg-green-50 px-3 py-1 rounded-full">
            <Text className="text-green-600 font-semibold text-sm">
              ₹{doctor.consultationFee}
            </Text>
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
