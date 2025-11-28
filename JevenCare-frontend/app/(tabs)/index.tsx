import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import DoctorCard from "@/components/cards/DoctorCard";
import { doctorService } from "@/services/doctorService";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const quickActions = [
    {
      id: "1",
      title: "Book\nAppointment",
      icon: "calendar",
      color: "#2563eb",
      route: "/(tabs)/appointments",
    },
    {
      id: "2",
      title: "Find\nMedicines",
      icon: "medkit",
      color: "#10b981",
      route: "/medicines",
    },
    {
      id: "3",
      title: "Health\nRecords",
      icon: "document-text",
      color: "#f59e0b",
      route: "/(tabs)/records",
    },
    {
      id: "4",
      title: "AI\nCheckup",
      icon: "fitness",
      color: "#8b5cf6",
      route: "/symptom-checker",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchDoctors(), fetchSpecializations()]);
    setLoading(false);
  };

  const fetchDoctors = async () => {
    const result = await doctorService.getDoctors({ page: 1, limit: 5 });
    if (result.success) {
      setDoctors(result.data.data || []);
    }
  };

  const fetchSpecializations = async () => {
    const result = await doctorService.getSpecializations();
    if (result.success) {
      setSpecializations(result.data.slice(0, 6));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-600 mt-4">Loading....</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-blue-600 px-6 pt-4 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-white text-lg">Good Morning 👋</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                Welcome to JevenCare
              </Text>
            </View>
            <TouchableOpacity className="bg-white/20 p-2 rounded-full">
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="bg-white rounded-2xl flex-row items-center px-4 py-3">
            <Ionicons name="search" size={20} color={Colors.textSecondary} />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Search doctors, medicines..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className="bg-white rounded-2xl p-4 items-center border border-gray-200"
                style={{ width: "23%" }}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: action.color + "20" }}
                >
                  <Ionicons
                    name={action.icon as any}
                    size={24}
                    color={action.color}
                  />
                </View>
                <Text className="text-xs text-gray-700 text-center leading-4">
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Specializations */}
        {specializations.length > 0 && (
          <View className="px-6 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Specializations
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {specializations.map((spec, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white rounded-2xl p-4 mr-3 items-center border border-gray-200"
                  style={{ width: 100 }}
                  activeOpacity={0.7}
                >
                  <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mb-2">
                    <Ionicons name="medical" size={24} color={Colors.primary} />
                  </View>
                  <Text
                    className="text-xs text-gray-700 text-center"
                    numberOfLines={2}
                  >
                    {spec}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Top Doctors */}
        <View className="px-6 mt-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-800">Top Doctors</Text>
            <TouchableOpacity>
              <Text className="text-blue-600 font-semibold">See All</Text>
            </TouchableOpacity>
          </View>
          {doctors.length === 0 ? (
            <View className="bg-white rounded-2xl p-8 items-center">
              <Ionicons
                name="medical-outline"
                size={48}
                color={Colors.textSecondary}
              />
              <Text className="text-gray-500 mt-4 text-center">
                No doctors available
              </Text>
              <Text className="text-gray-400 text-sm mt-2 text-center">
                Please check back later
              </Text>
            </View>
          ) : (
            doctors.map((doctor: any) => {
              // Safe check for userId
              if (!doctor.userId) {
                console.warn("Doctor missing userId:", doctor);
                return null;
              }

              return (
                <DoctorCard
                  key={doctor._id}
                  doctor={{
                    id: doctor._id,
                    name: doctor.userId?.name || "Unknown Doctor",
                    specialization: doctor.specialization,
                    experience: doctor.experience,
                    languages: doctor.languages || [],
                    consultationFee: doctor.consultationFee,
                    profileImage:
                      doctor.userId?.profileImage ||
                      "https://i.pravatar.cc/150",
                    rating: doctor.rating,
                  }}
                  onPress={() => router.push(`/doctor/${doctor._id}`)}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
