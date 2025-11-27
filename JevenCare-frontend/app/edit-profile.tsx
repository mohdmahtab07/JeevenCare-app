import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { authService } from "@/services/authService";
import { Colors } from "@/constants/Colors";

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    language: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const result = await authService.getCurrentUser();

    if (result.success) {
      setFormData({
        name: result.data.name || "",
        email: result.data.email || "",
        address: result.data.address || "",
        language: result.data.language || "English",
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    setSaving(true);

    // For now, we'll just show success since we need to add update endpoint to backend
    // TODO: Add update profile API endpoint
    Alert.alert(
      "Coming Soon",
      "Profile update feature will be implemented soon",
      [{ text: "OK", onPress: () => router.back() }]
    );

    setSaving(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
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
            Edit Profile
          </Text>
        </View>

        {/* Profile Picture */}
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center">
            <Text className="text-4xl font-bold text-blue-600">
              {formData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity className="mt-3">
            <Text className="text-blue-600 font-semibold">Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="px-6 py-4">
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <Input
            label="Email"
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
          />

          <Input
            label="Language"
            placeholder="Preferred language"
            value={formData.language}
            onChangeText={(text) =>
              setFormData({ ...formData, language: text })
            }
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          title={saving ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          loading={saving}
        />
      </View>
    </SafeAreaView>
  );
}
