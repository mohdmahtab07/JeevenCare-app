import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import { Colors } from "@/constants/Colors";

export default function BookAppointmentScreen() {
  const { doctorId } = useLocalSearchParams();
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultationType, setConsultationType] = useState<"video" | "chat">(
    "video"
  );

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ];

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
  }, [doctorId]);

  const fetchDoctor = async () => {
    setLoading(true);
    console.log("Fetching doctor with ID:", doctorId);

    const result = await doctorService.getDoctorById(doctorId as string);

    if (result.success) {
      console.log("Doctor fetched:", result.data);
      setDoctor(result.data);
    } else {
      console.error("Failed to fetch doctor:", result.message);
      Alert.alert("Error", result.message || "Failed to fetch doctor details", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
    setLoading(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      Alert.alert("Error", "Please select a time slot");
      return;
    }

    if (!symptoms.trim()) {
      Alert.alert("Error", "Please describe your symptoms");
      return;
    }

    // Combine date and time
    const [time, period] = selectedSlot.split(" ");
    const [hours, minutes] = time.split(":");
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(hour, parseInt(minutes), 0, 0);

    // Check if appointment is in the past
    if (appointmentDate < new Date()) {
      Alert.alert("Error", "Cannot book appointment in the past");
      return;
    }

    setBookingLoading(true);

    // Use userId for booking (this is the actual user ID, not doctor document ID)
    const doctorUserId = doctor.userId?._id || doctor.userId;

    console.log("Booking appointment with:", {
      doctorUserId,
      dateTime: appointmentDate.toISOString(),
      type: consultationType,
      symptoms: symptoms.trim(),
    });

    const result = await appointmentService.bookAppointment({
      doctorId: doctorUserId,
      dateTime: appointmentDate.toISOString(),
      type: consultationType,
      symptoms: symptoms.trim(),
    });

    setBookingLoading(false);

    if (result.success) {
      Alert.alert("Success", "Appointment booked successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/appointments"),
        },
      ]);
    } else {
      Alert.alert("Error", result.message || "Failed to book appointment");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-600 mt-4">Loading doctor details...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle" size={64} color={Colors.error} />
        <Text className="text-gray-800 text-lg font-bold mt-4">
          Doctor not found
        </Text>
        <Text className="text-gray-600 mt-2 text-center px-6">
          Unable to load doctor details. Please try again.
        </Text>
        <TouchableOpacity
          className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 ml-4">
            Book Appointment
          </Text>
        </View>

        {/* Doctor Info */}
        <View className="px-6 py-4 bg-blue-50 flex-row items-center">
          <View className="w-16 h-16 bg-blue-200 rounded-full items-center justify-center">
            <Text className="text-2xl">👨‍⚕️</Text>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-lg font-bold text-gray-800">
              {doctor.userId?.name || doctor.name || "Unknown Doctor"}
            </Text>
            <Text className="text-gray-600">{doctor.specialization}</Text>
            <Text className="text-green-600 font-semibold mt-1">
              ₹{doctor.consultationFee}
            </Text>
          </View>
        </View>

        <View className="px-6 py-6">
          {/* Consultation Type */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Consultation Type
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl mr-2 border-2 ${
                  consultationType === "video"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
                onPress={() => setConsultationType("video")}
              >
                <Ionicons
                  name="videocam"
                  size={24}
                  color={
                    consultationType === "video"
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
                <Text
                  className={`mt-2 font-semibold ${
                    consultationType === "video"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Video Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 p-4 rounded-xl ml-2 border-2 ${
                  consultationType === "chat"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
                onPress={() => setConsultationType("chat")}
              >
                <Ionicons
                  name="chatbubbles"
                  size={24}
                  color={
                    consultationType === "chat"
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
                <Text
                  className={`mt-2 font-semibold ${
                    consultationType === "chat"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Chat
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Select Date */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Select Date
            </Text>
            <TouchableOpacity
              className="border-2 border-gray-200 rounded-xl p-4 flex-row items-center justify-between"
              onPress={() => setShowDatePicker(true)}
            >
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={20} color={Colors.primary} />
                <Text className="text-gray-800 ml-3">
                  {selectedDate.toLocaleDateString("en-IN", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Select Time Slot */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Select Time Slot
            </Text>
            <View className="flex-row flex-wrap">
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  className={`px-4 py-3 rounded-xl mr-2 mb-2 border-2 ${
                    selectedSlot === slot
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text
                    className={`font-medium ${
                      selectedSlot === slot ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Symptoms */}
          <View className="mb-6">
            <Input
              label="Describe Your Symptoms"
              placeholder="Please describe what you're experiencing..."
              multiline
              numberOfLines={4}
              value={symptoms}
              onChangeText={setSymptoms}
            />
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          title={`Book Appointment - ₹${doctor.consultationFee}`}
          onPress={handleBookAppointment}
          loading={bookingLoading}
        />
      </View>
    </SafeAreaView>
  );
}
