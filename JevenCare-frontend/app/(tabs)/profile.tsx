import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { authService } from "@/services/authService";
import { Colors } from "@/constants/Colors";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    const result = await authService.getCurrentUser();

    if (result.success) {
      setUser(result.data);
    } else {
      Alert.alert("Error", result.message || "Failed to fetch profile");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await authService.logout();
          router.replace("/");
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const profileMenuItems = [
    {
      id: "edit",
      title: "Edit Profile",
      icon: "person-outline",
      onPress: handleEditProfile,
    },
    {
      id: "appointments",
      title: "My Appointments",
      icon: "calendar-outline",
      onPress: () => router.push("/(tabs)/appointments"),
    },
    {
      id: "records",
      title: "Health Records",
      icon: "document-text-outline",
      onPress: () => router.push("/(tabs)/records"),
    },
    {
      id: "settings",
      title: "Settings",
      icon: "settings-outline",
      onPress: () =>
        Alert.alert("Coming Soon", "Settings feature will be available soon"),
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => Alert.alert("Help", "Contact us at support@jevencare.com"),
    },
    {
      id: "about",
      title: "About JevenCare",
      icon: "information-circle-outline",
      onPress: () =>
        Alert.alert("About", "JevenCare v1.0.0\nYour Health, Our Priority"),
    },
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Ionicons
          name="person-circle-outline"
          size={80}
          color={Colors.textSecondary}
        />
        <Text className="text-gray-600 mt-4">Failed to load profile</Text>
        <TouchableOpacity
          className="mt-4 bg-blue-600 px-6 py-3 rounded-xl"
          onPress={fetchUserProfile}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        </View>

        {/* Profile Info */}
        <View className="bg-white px-6 py-8 items-center border-b border-gray-200">
          {/* Profile Image */}
          <View className="relative">
            {user.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-blue-100 items-center justify-center">
                <Text className="text-4xl font-bold text-blue-600">
                  {user.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-blue-600 w-8 h-8 rounded-full items-center justify-center"
              onPress={handleEditProfile}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text className="text-2xl font-bold text-gray-800 mt-4">
            {user.name}
          </Text>
          {user.email && (
            <Text className="text-gray-600 mt-1">{user.email}</Text>
          )}
          <Text className="text-gray-600 mt-1">{user.phone}</Text>

          {/* Role Badge */}
          <View className="bg-blue-50 px-4 py-2 rounded-full mt-3">
            <Text className="text-blue-600 font-semibold capitalize">
              {user.role}
            </Text>
          </View>

          {/* Verified Badge */}
          {user.isVerified && (
            <View className="flex-row items-center mt-3">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
              <Text className="text-green-600 font-medium ml-1">
                Verified Account
              </Text>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View className="bg-white px-6 py-4 mt-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Personal Information
          </Text>

          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="call" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Phone Number</Text>
                <Text className="text-gray-800 font-semibold">
                  {user.phone}
                </Text>
              </View>
            </View>

            {user.email && (
              <>
                <View className="h-px bg-gray-200 my-2" />
                <View className="flex-row items-center mb-4">
                  <Ionicons name="mail" size={20} color={Colors.primary} />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-600 text-sm">Email</Text>
                    <Text className="text-gray-800 font-semibold">
                      {user.email}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {user.address && (
              <>
                <View className="h-px bg-gray-200 my-2" />
                <View className="flex-row items-center">
                  <Ionicons name="location" size={20} color={Colors.primary} />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-600 text-sm">Address</Text>
                    <Text className="text-gray-800 font-semibold">
                      {user.address}
                    </Text>
                  </View>
                </View>
              </>
            )}

            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row items-center">
              <Ionicons name="language" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Language</Text>
                <Text className="text-gray-800 font-semibold">
                  {user.language || "English"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white px-6 py-4 mt-4">
          {profileMenuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center py-4 ${
                index !== profileMenuItems.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }`}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text className="flex-1 text-gray-800 font-medium ml-4">
                {item.title}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View className="px-6 py-6">
          <TouchableOpacity
            className="bg-red-50 py-4 rounded-xl flex-row items-center justify-center"
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text className="text-red-600 font-bold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View className="items-center pb-6">
          <Text className="text-gray-400 text-sm">JevenCare v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
