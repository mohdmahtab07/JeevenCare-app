import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { appointmentService } from "@/services/appointmentService";
import { Colors } from "@/constants/Colors";

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    setLoading(true);
    const result = await appointmentService.getAppointmentById(id as string);
    if (result.success) {
      setAppointment(result.data);
    }
    setLoading(false);
  };

  const handleCancelAppointment = () => {
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
              id as string,
              "Cancelled by patient"
            );
            if (result.success) {
              Alert.alert("Success", "Appointment cancelled successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
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

  const getStatusInfo = () => {
    if (!appointment)
      return { icon: "time", color: "blue", text: "Processing" };

    switch (appointment.status) {
      case "scheduled":
        return {
          icon: "checkmark-circle",
          color: "blue",
          text: "Appointment Confirmed",
        };
      case "ongoing":
        return {
          icon: "videocam",
          color: "green",
          text: "Consultation Ongoing",
        };
      case "completed":
        return {
          icon: "checkmark-done",
          color: "green",
          text: "Appointment Completed",
        };
      case "cancelled":
        return {
          icon: "close-circle",
          color: "red",
          text: "Appointment Cancelled",
        };
      default:
        return { icon: "time", color: "gray", text: "Unknown Status" };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Appointment not found</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-4">
            Appointment Details
          </Text>
        </View>

        {/* Status Badge */}
        <View className="px-6 py-4">
          <View
            className={`bg-${statusInfo.color}-50 p-4 rounded-2xl flex-row items-center`}
          >
            <View
              className={`w-12 h-12 bg-${statusInfo.color}-600 rounded-full items-center justify-center`}
            >
              <Ionicons name={statusInfo.icon as any} size={24} color="white" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold text-gray-800 capitalize">
                {appointment.status}
              </Text>
              <Text className="text-gray-600 mt-1">{statusInfo.text}</Text>
            </View>
          </View>
        </View>

        {/* Appointment Info */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Appointment Information
          </Text>

          <View className="bg-gray-50 rounded-2xl p-4 space-y-4">
            <View className="flex-row items-center">
              <Ionicons name="person" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Doctor</Text>
                <Text className="text-gray-800 font-semibold">
                  {appointment.doctorId?.name || "Dr. Unknown"}
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200" />

            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Date</Text>
                <Text className="text-gray-800 font-semibold">
                  {new Date(appointment.dateTime).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200" />

            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Time</Text>
                <Text className="text-gray-800 font-semibold">
                  {new Date(appointment.dateTime).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200" />

            <View className="flex-row items-center">
              <Ionicons
                name={appointment.type === "video" ? "videocam" : "chatbubbles"}
                size={20}
                color={Colors.primary}
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Consultation Type</Text>
                <Text className="text-gray-800 font-semibold capitalize">
                  {appointment.type} Call
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200" />

            <View className="flex-row items-center">
              <Ionicons name="cash" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Consultation Fee</Text>
                <Text className="text-gray-800 font-semibold">
                  ₹{appointment.consultationFee}
                </Text>
              </View>
            </View>
          </View>

          {/* Symptoms */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Symptoms Reported
            </Text>
            <View className="bg-orange-50 p-4 rounded-2xl">
              <Text className="text-gray-700">{appointment.symptoms}</Text>
            </View>
          </View>

          {/* Prescription (if completed) */}
          {appointment.prescription &&
            appointment.prescription.medicines?.length > 0 && (
              <View className="mt-6">
                <Text className="text-lg font-bold text-gray-800 mb-3">
                  Prescription
                </Text>
                <View className="bg-green-50 p-4 rounded-2xl">
                  {appointment.prescription.medicines.map(
                    (med: any, index: number) => (
                      <View key={index} className="mb-3">
                        <Text className="font-bold text-gray-800">
                          {med.name}
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          {med.dosage} - {med.duration}
                        </Text>
                        {med.instructions && (
                          <Text className="text-gray-500 text-xs mt-1">
                            {med.instructions}
                          </Text>
                        )}
                      </View>
                    )
                  )}
                  {appointment.prescription.notes && (
                    <View className="mt-3 pt-3 border-t border-green-200">
                      <Text className="text-gray-700">
                        {appointment.prescription.notes}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

          {/* Cancel Reason (if cancelled) */}
          {appointment.status === "cancelled" && appointment.cancelReason && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Cancellation Reason
              </Text>
              <View className="bg-red-50 p-4 rounded-2xl">
                <Text className="text-gray-700">
                  {appointment.cancelReason}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {appointment.status === "scheduled" && (
        <View className="px-6 py-4 border-t border-gray-200">
          <Button
            title="Join Video Call"
            onPress={() => router.push(`./video-call/${appointment._id}`)}
            className="mb-3"
          />
          <Button
            title="Cancel Appointment"
            onPress={handleCancelAppointment}
            variant="outline"
          />
        </View>
      )}

      {appointment.status === "completed" && (
        <View className="px-6 py-4 border-t border-gray-200">
          <Button
            title="Download Prescription"
            onPress={() =>
              Alert.alert("Feature Coming Soon", "Download prescription as PDF")
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
