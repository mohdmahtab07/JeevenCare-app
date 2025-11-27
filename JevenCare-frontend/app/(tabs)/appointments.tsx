import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { appointmentService } from "@/services/appointmentService";
import { Colors } from "@/constants/Colors";

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming"
  );
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch appointments when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [activeTab])
  );

  const fetchAppointments = async () => {
    setLoading(true);
    const status = activeTab === "upcoming" ? "scheduled" : "completed";

    console.log("Fetching appointments with status:", status);

    const result = await appointmentService.getAppointments({ status });

    console.log("Appointments result:", result);

    if (result.success) {
      setAppointments(result.data.data || []);
    } else {
      console.error("Failed to fetch appointments:", result.message);
      Alert.alert("Error", result.message || "Failed to fetch appointments");
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const result = await appointmentService.cancelAppointment(
              appointmentId,
              "Cancelled by patient"
            );
            if (result.success) {
              Alert.alert("Success", "Appointment cancelled successfully");
              fetchAppointments();
            } else {
              Alert.alert(
                "Error",
                result.message || "Failed to cancel appointment"
              );
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return { bg: "bg-blue-100", text: "text-blue-600" };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-600" };
      case "ongoing":
        return { bg: "bg-orange-100", text: "text-orange-600" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-600 mt-4">Loading appointments...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          My Appointments
        </Text>
      </View>

      {/* Tabs */}
      <View className="bg-white px-6 py-4 flex-row">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl mr-2 ${
            activeTab === "upcoming" ? "bg-blue-600" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "upcoming" ? "text-white" : "text-gray-600"
            }`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl ml-2 ${
            activeTab === "completed" ? "bg-blue-600" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("completed")}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "completed" ? "text-white" : "text-gray-600"
            }`}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointments.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons
              name="calendar-outline"
              size={64}
              color={Colors.textSecondary}
            />
            <Text className="text-gray-500 mt-4 text-center">
              No {activeTab} appointments
            </Text>
            <TouchableOpacity
              className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
              onPress={() => router.push("/(tabs)")}
            >
              <Text className="text-white font-semibold">Book Appointment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-sm text-gray-500 mb-4">
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""}
            </Text>
            {appointments.map((appointment) => {
              const statusColors = getStatusColor(appointment.status);

              return (
                <TouchableOpacity
                  key={appointment._id}
                  className="bg-white rounded-2xl p-4 mb-4 border border-gray-200"
                  onPress={() => router.push(`/appointment/${appointment._id}`)}
                  activeOpacity={0.7}
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800">
                        {appointment.doctorId?.name || "Dr. Unknown"}
                      </Text>
                      <Text className="text-gray-600 mt-1">
                        {appointment.doctorId?.specialization || "Doctor"}
                      </Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${statusColors.bg}`}
                    >
                      <Text
                        className={`text-xs font-semibold capitalize ${statusColors.text}`}
                      >
                        {appointment.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={Colors.textSecondary}
                    />
                    <Text className="text-gray-600 ml-2">
                      {formatDate(appointment.dateTime)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="time"
                      size={16}
                      color={Colors.textSecondary}
                    />
                    <Text className="text-gray-600 ml-2">
                      {formatTime(appointment.dateTime)}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        appointment.type === "video"
                          ? "videocam"
                          : "chatbubbles"
                      }
                      size={16}
                      color={Colors.textSecondary}
                    />
                    <Text className="text-gray-600 ml-2 capitalize">
                      {appointment.type} Consultation
                    </Text>
                  </View>

                  {appointment.status === "scheduled" && (
                    <View className="flex-row mt-4 space-x-2">
                      <TouchableOpacity
                        className="flex-1 bg-blue-600 py-3 rounded-xl mr-2"
                        onPress={() =>
                          router.push(`./video-call/${appointment._id}`)
                        }
                      >
                        <Text className="text-white text-center font-semibold">
                          Join Call
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 border-2 border-red-200 py-3 rounded-xl ml-2"
                        onPress={() => handleCancelAppointment(appointment._id)}
                      >
                        <Text className="text-red-600 text-center font-semibold">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
