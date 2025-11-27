import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { doctorService } from "@/services/doctorService";
import { Colors } from "@/constants/Colors";

export default function DoctorDetailScreen() {
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    setLoading(true);
    const result = await doctorService.getDoctorById(id as string);
    if (result.success) {
      setDoctor(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!doctor) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Doctor not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
            onPress={() => router.back()}
          />
          <Text className="text-xl font-bold text-gray-800 ml-4">
            Doctor Details
          </Text>
        </View>

        {/* Doctor Profile */}
        <View className="items-center py-6 border-b border-gray-200">
          <Image
            source={{
              uri: doctor.userId.profileImage || "https://i.pravatar.cc/150",
            }}
            className="w-32 h-32 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold text-gray-800">
            {doctor.userId.name}
          </Text>
          <Text className="text-gray-600 mt-1">{doctor.specialization}</Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-gray-600 ml-1">
              {doctor.rating} • {doctor.experience} years experience
            </Text>
          </View>
        </View>

        {/* Info Sections */}
        <View className="px-6 py-6">
          {/* Qualifications */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Qualifications
            </Text>
            <View className="flex-row flex-wrap">
              {doctor.qualifications.map((qual: string, index: number) => (
                <View
                  key={index}
                  className="bg-blue-50 px-4 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-blue-600 font-medium">{qual}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Languages */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Languages
            </Text>
            <Text className="text-gray-600">{doctor.languages.join(", ")}</Text>
          </View>

          {/* Availability */}
          {doctor.availableSlots && doctor.availableSlots.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Available Slots
              </Text>
              {doctor.availableSlots.map((slot: any, index: number) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Ionicons name="time" size={18} color={Colors.primary} />
                  <Text className="text-gray-700 ml-2">
                    {slot.day}: {slot.startTime} - {slot.endTime}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Consultation Fee */}
          <View className="bg-green-50 p-4 rounded-2xl mb-6">
            <Text className="text-gray-700 mb-1">Consultation Fee</Text>
            <Text className="text-2xl font-bold text-green-600">
              ₹{doctor.consultationFee}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Book Appointment Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          title="Book Appointment"
          onPress={() =>
            router.push(`/book-appointment?doctorId=${doctor._id}`)
          }
        />
      </View>
    </SafeAreaView>
  );
}
