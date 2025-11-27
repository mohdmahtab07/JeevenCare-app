import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const roles = [
  {
    id: "patient",
    title: "Patient",
    icon: "person",
    color: "#2563eb",
    description: "Book appointments & consult doctors",
  },
  {
    id: "doctor",
    title: "Doctor",
    icon: "medical",
    color: "#10b981",
    description: "Provide consultations & prescriptions",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    icon: "medkit",
    color: "#f59e0b",
    description: "Manage medicines & orders",
  },
];

export default function RoleSelectionScreen() {
  const handleRoleSelect = (role: string) => {
    // Store selected role and navigate to login
    router.push(`./login?role=${role}`);
  };

  return (
    <View className="flex-1 bg-white px-6 py-12">
      <Text className="text-3xl font-bold text-gray-800 mb-2">I am a...</Text>
      <Text className="text-gray-600 mb-8">Select your role to continue</Text>

      <View className="space-y-4">
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            className="border-2 border-gray-200 rounded-2xl p-6 flex-row items-center"
            onPress={() => handleRoleSelect(role.id)}
            activeOpacity={0.7}
          >
            <View
              className="w-14 h-14 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: role.color + "20" }}
            >
              <Ionicons name={role.icon as any} size={28} color={role.color} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-semibold text-gray-800">
                {role.title}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {role.description}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
