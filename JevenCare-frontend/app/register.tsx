import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function RegisterScreen() {
  const { role } = useLocalSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (formData.phone.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    const result = await authService.register(
      formData.phone,
      formData.name,
      role as string,
      formData.email,
      formData.address
    );

    setLoading(false);

    if (result.success) {
      Alert.alert(
        "Success",
        "Registration successful! OTP sent to your phone.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(`/login?role=${role}&phone=${formData.phone}`),
          },
        ]
      );
    } else {
      Alert.alert("Error", result.message || "Registration failed");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-12">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800">
            Create Account
          </Text>
          <Text className="text-gray-600 mt-2">
            Register as <Text className="font-semibold capitalize">{role}</Text>
          </Text>
        </View>

        <Input
          label="Full Name *"
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <Input
          label="Phone Number *"
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
        />

        <Input
          label="Email (Optional)"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />

        <Input
          label="Address"
          placeholder="Enter your address"
          multiline
          numberOfLines={3}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          containerClassName="mb-6"
        />

        <Button title="Register" onPress={handleRegister} loading={loading} />

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Already have an account? </Text>
          <Text
            className="text-blue-600 font-semibold"
            onPress={() => router.back()}
          >
            Login
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
