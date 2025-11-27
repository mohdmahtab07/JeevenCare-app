import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import RecordCard from "@/components/cards/RecordCard";
import UploadRecordModal from "@/components/UploadRecordModal";
import { healthRecordService } from "@/services/healthRecordService";
import { Colors } from "@/constants/Colors";

type RecordType = "all" | "prescription" | "lab_report" | "visit_summary";

export default function RecordsScreen() {
  const [activeFilter, setActiveFilter] = useState<RecordType>("all");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filters = [
    { id: "all", label: "All", icon: "grid" },
    { id: "prescription", label: "Prescriptions", icon: "medical" },
    { id: "lab_report", label: "Lab Reports", icon: "flask" },
    { id: "visit_summary", label: "Visit Notes", icon: "document-text" },
  ];

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchRecords();
    }, [activeFilter])
  );

  const fetchRecords = async () => {
    setLoading(true);
    const type = activeFilter === "all" ? undefined : activeFilter;

    console.log("Fetching records with type:", type);

    const result = await healthRecordService.getRecords({ type });

    console.log("Records result:", result);

    if (result.success) {
      setRecords(result.data.data || []);
    } else {
      console.error("Failed to fetch records:", result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecords();
    setRefreshing(false);
  };

  const handleUploadSuccess = () => {
    fetchRecords();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-600 mt-4">Loading records...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-800">
            Health Records
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center"
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons name="cloud-upload" size={18} color="white" />
            <Text className="text-white font-semibold ml-2">Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white px-6 py-4 border-b border-gray-200"
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            className={`px-4 py-2 rounded-xl mr-3 flex-row items-center ${
              activeFilter === filter.id ? "bg-blue-600" : "bg-gray-100"
            }`}
            onPress={() => setActiveFilter(filter.id as RecordType)}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={
                activeFilter === filter.id ? "white" : Colors.textSecondary
              }
            />
            <Text
              className={`ml-2 font-medium ${
                activeFilter === filter.id ? "text-white" : "text-gray-600"
              }`}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Records List */}
      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {records.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons
              name="folder-open-outline"
              size={64}
              color={Colors.textSecondary}
            />
            <Text className="text-gray-500 mt-4 text-center">
              No records found
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-6">
              {activeFilter === "all"
                ? "Upload your medical documents to get started"
                : `No ${activeFilter.replace("_", " ")} records yet`}
            </Text>
            <TouchableOpacity
              className="mt-6 bg-blue-600 px-6 py-3 rounded-xl"
              onPress={() => setShowUploadModal(true)}
            >
              <Text className="text-white font-semibold">Upload Record</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-sm text-gray-500 mb-4">
              {records.length} record{records.length !== 1 ? "s" : ""} found
            </Text>
            {records.map((record) => (
              <RecordCard
                key={record._id}
                record={{
                  id: record._id,
                  patientId: record.patientId,
                  date: record.date,
                  type: record.type,
                  title: record.title,
                  notes: record.description,
                  doctorId: record.doctorId?._id || "",
                  fileUrl: record.fileUrl,
                }}
                onPress={() => router.push(`/record/${record._id}`)}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Upload Modal */}
      <UploadRecordModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
      />
    </SafeAreaView>
  );
}
