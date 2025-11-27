import { View, Text, Image } from "react-native";
import { router } from "expo-router";
import Button from "@/components/ui/Button";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold text-blue-600 mb-2">JevenCare</Text>
        <Text className="text-gray-600 text-center text-base">
          Quality Healthcare for Rural India
        </Text>
      </View>

      <View className="mb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Welcome!</Text>
        <Text className="text-gray-600 text-base leading-6">
          Connect with doctors, access your health records, and find medicines
          near you - all in your local language.
        </Text>
      </View>

      <Button
        title="Get Started"
        onPress={() => router.push("./role-selection")}
      />

      <Text className="text-center text-gray-500 text-sm mt-6">
        Healthcare made simple and accessible
      </Text>
    </View>
  );
}
