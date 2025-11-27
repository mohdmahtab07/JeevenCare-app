import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function LoginScreen() {
  const { role, phone: initialPhone } = useLocalSearchParams();
  const [phoneNumber, setPhoneNumber] = useState(
    initialPhone?.toString() || ""
  );
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    const result = await authService.sendOTP(phoneNumber);
    setLoading(false);

    if (result.success) {
      setShowOtpInput(true);
      Alert.alert(
        "Success",
        "OTP sent to your phone number (Use: 123456 for testing)"
      );
    } else {
      Alert.alert("Error", result.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    const result = await authService.verifyOTP(phoneNumber, otp);
    setLoading(false);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Error", result.message || "Invalid OTP");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-12">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-800">Welcome Back</Text>
        <Text className="text-gray-600 mt-2">
          Login as <Text className="font-semibold capitalize">{role}</Text>
        </Text>
      </View>

      <Input
        label="Phone Number"
        placeholder="Enter 10-digit phone number"
        keyboardType="phone-pad"
        maxLength={10}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        editable={!showOtpInput}
      />

      {showOtpInput && (
        <>
          <Input
            label="Enter OTP"
            placeholder="Enter 6-digit OTP (123456)"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity
            className="mb-4"
            onPress={() => {
              setShowOtpInput(false);
              setOtp("");
            }}
          >
            <Text className="text-blue-600 text-sm">Change phone number?</Text>
          </TouchableOpacity>
        </>
      )}

      {!showOtpInput ? (
        <Button title="Send OTP" onPress={handleSendOTP} loading={loading} />
      ) : (
        <Button
          title="Verify & Login"
          onPress={handleVerifyOTP}
          loading={loading}
        />
      )}

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push(`/register?role=${role}`)}>
          <Text className="text-blue-600 font-semibold">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
