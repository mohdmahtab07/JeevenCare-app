import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export default function VideoCallScreen() {
  const { appointmentId } = useLocalSearchParams();

  const handleEndCall = () => {
    Alert.alert("End Call", "Are you sure you want to end this call?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End Call",
        style: "destructive",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Video Area Placeholder */}
      <View className="flex-1 items-center justify-center">
        <View className="w-32 h-32 bg-gray-800 rounded-full items-center justify-center mb-4">
          <Ionicons name="videocam" size={64} color="white" />
        </View>
        <Text className="text-white text-xl font-bold">Video Call</Text>
        <Text className="text-gray-400 mt-2">
          Waiting for doctor to join...
        </Text>

        <View className="mt-8 bg-yellow-900/30 px-6 py-4 rounded-xl">
          <Text className="text-yellow-300 text-center text-base">
            🚧 Video Call Integration Coming Soon
          </Text>
          <Text className="text-yellow-200 text-sm text-center mt-2">
            Will integrate Agora/Twilio Video SDK
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View className="px-6 py-8">
        <View className="flex-row justify-center space-x-6">
          <TouchableOpacity className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center">
            <Ionicons name="mic-off" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center">
            <Ionicons name="videocam-off" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-16 h-16 bg-red-600 rounded-full items-center justify-center"
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 text-center mt-6">
          Appointment ID: {appointmentId}
        </Text>
      </View>
    </SafeAreaView>
  );
}
