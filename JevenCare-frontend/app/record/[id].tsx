import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { healthRecordService } from "@/services/healthRecordService";
import { Colors } from "@/constants/Colors";

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    setLoading(true);
    const result = await healthRecordService.getRecordById(id as string);
    if (result.success) {
      setRecord(result.data);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (record.fileUrl) {
      Linking.openURL(record.fileUrl);
    } else {
      Alert.alert("No File", "This record has no attached file");
    }
  };

  const handleShare = () => {
    if (record.fileUrl) {
      Alert.alert("Share", "Sharing functionality will be implemented soon");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await healthRecordService.deleteRecord(id as string);
            if (result.success) {
              Alert.alert("Success", "Record deleted successfully", [
                { text: "OK", onPress: () => router.back() },
              ]);
            } else {
              Alert.alert("Error", result.message || "Failed to delete record");
            }
          },
        },
      ]
    );
  };

  const getIcon = () => {
    switch (record?.type) {
      case "prescription":
        return "medical";
      case "lab_report":
        return "flask";
      case "visit_summary":
        return "document-text";
      default:
        return "document";
    }
  };

  const getColor = () => {
    switch (record?.type) {
      case "prescription":
        return "#2563eb";
      case "lab_report":
        return "#10b981";
      case "visit_summary":
        return "#f59e0b";
      default:
        return Colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!record) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Record not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 ml-4">
              Record Details
            </Text>
          </View>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Record Icon */}
        <View className="items-center py-8">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: getColor() + "20" }}
          >
            <Ionicons name={getIcon() as any} size={40} color={getColor()} />
          </View>
          <Text className="text-2xl font-bold text-gray-800 text-center px-6">
            {record.title}
          </Text>
          <Text className="text-gray-600 mt-2 capitalize">
            {record.type.replace("_", " ")}
          </Text>
        </View>

        {/* Record Details */}
        <View className="px-6 py-4">
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="calendar" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Date</Text>
                <Text className="text-gray-800 font-semibold">
                  {new Date(record.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
            </View>

            {record.doctorId && (
              <>
                <View className="h-px bg-gray-200 my-2" />
                <View className="flex-row items-center mb-4">
                  <Ionicons name="person" size={20} color={Colors.primary} />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-600 text-sm">Doctor</Text>
                    <Text className="text-gray-800 font-semibold">
                      {record.doctorId.name || "Dr. Unknown"}
                    </Text>
                  </View>
                </View>
              </>
            )}

            {record.fileUrl && (
              <>
                <View className="h-px bg-gray-200 my-2" />
                <View className="flex-row items-center">
                  <Ionicons name="attach" size={20} color={Colors.primary} />
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-600 text-sm">Attachment</Text>
                    <Text className="text-gray-800 font-semibold">
                      Document Available
                    </Text>
                  </View>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.success}
                  />
                </View>
              </>
            )}
          </View>

          {/* Description */}
          <View className="mt-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Description
            </Text>
            <View className="bg-blue-50 p-4 rounded-2xl">
              <Text className="text-gray-700 leading-6">
                {record.description}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="px-6 py-4 border-t border-gray-200">
        {record.fileUrl ? (
          <View className="flex-row space-x-3">
            <View className="flex-1 mr-2">
              <Button
                title="Download"
                onPress={handleDownload}
                variant="primary"
              />
            </View>
            <View className="flex-1 ml-2">
              <Button title="Share" onPress={handleShare} variant="outline" />
            </View>
          </View>
        ) : (
          <Button
            title="Back to Records"
            onPress={() => router.back()}
            variant="outline"
          />
        )}
      </View>
    </SafeAreaView>
  );
}
