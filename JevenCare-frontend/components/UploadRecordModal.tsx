import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { healthRecordService } from "@/services/healthRecordService";
import { Colors } from "@/constants/Colors";

interface UploadRecordModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UploadRecordModal({
  visible,
  onClose,
  onSuccess,
}: UploadRecordModalProps) {
  const [type, setType] = useState<string>("prescription");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const recordTypes = [
    { id: "prescription", label: "Prescription", icon: "medical" },
    { id: "lab_report", label: "Lab Report", icon: "flask" },
    { id: "visit_summary", label: "Visit Summary", icon: "document-text" },
    { id: "scan", label: "Scan/X-Ray", icon: "images" },
    { id: "other", label: "Other", icon: "folder" },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload images"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setFile({
        uri: result.assets[0].uri,
        name: `image_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      setFile({
        uri: result.assets[0].uri,
        name: result.assets[0].name,
        type: result.assets[0].mimeType || "application/pdf",
      });
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    formData.append("description", description);

    if (file) {
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    }

    console.log("Uploading record:", {
      type,
      title,
      description,
      hasFile: !!file,
    });

    const result = await healthRecordService.uploadRecord(formData);
    setUploading(false);

    console.log("Upload result:", result);

    if (result.success) {
      Alert.alert("Success", "Record uploaded successfully!");
      resetForm();
      onSuccess();
      onClose();
    } else {
      Alert.alert("Error", result.message || "Failed to upload record");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setType("prescription");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ maxHeight: "90%" }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-800">
              Upload Record
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="px-6 py-4">
            {/* Record Type */}
            <Text className="text-base font-bold text-gray-800 mb-3">
              Record Type
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {recordTypes.map((recordType) => (
                <TouchableOpacity
                  key={recordType.id}
                  className={`px-4 py-3 rounded-xl mr-2 mb-2 border-2 ${
                    type === recordType.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onPress={() => setType(recordType.id)}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name={recordType.icon as any}
                      size={18}
                      color={
                        type === recordType.id
                          ? Colors.primary
                          : Colors.textSecondary
                      }
                    />
                    <Text
                      className={`ml-2 font-medium ${
                        type === recordType.id
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {recordType.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <Input
              label="Title"
              placeholder="e.g., Blood Test Results"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description */}
            <Input
              label="Description"
              placeholder="Add notes about this record..."
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
            />

            {/* File Upload */}
            <Text className="text-base font-bold text-gray-800 mb-3">
              Attach File (Optional)
            </Text>
            <View className="flex-row mb-6">
              <TouchableOpacity
                className="flex-1 bg-gray-100 p-4 rounded-xl flex-row items-center justify-center mr-2"
                onPress={pickImage}
              >
                <Ionicons name="image" size={20} color={Colors.primary} />
                <Text className="text-gray-700 font-semibold ml-2">Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-gray-100 p-4 rounded-xl flex-row items-center justify-center ml-2"
                onPress={pickDocument}
              >
                <Ionicons name="document" size={20} color={Colors.primary} />
                <Text className="text-gray-700 font-semibold ml-2">
                  Document
                </Text>
              </TouchableOpacity>
            </View>

            {file && (
              <View className="bg-green-50 p-3 rounded-xl flex-row items-center mb-6">
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.success}
                />
                <Text className="text-gray-700 ml-2 flex-1" numberOfLines={1}>
                  {file.name}
                </Text>
                <TouchableOpacity onPress={() => setFile(null)}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Upload Button */}
            <Button
              title={uploading ? "Uploading..." : "Upload Record"}
              onPress={handleUpload}
              loading={uploading}
              disabled={uploading}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
