import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";

const commonSymptoms = [
  { id: "1", name: "Fever", icon: "thermometer" },
  { id: "2", name: "Cough", icon: "medical" },
  { id: "3", name: "Headache", icon: "sad" },
  { id: "4", name: "Body Pain", icon: "body" },
  { id: "5", name: "Fatigue", icon: "bed" },
  { id: "6", name: "Nausea", icon: "water" },
  { id: "7", name: "Chest Pain", icon: "heart" },
  { id: "8", name: "Shortness of Breath", icon: "fitness" },
];

export default function SymptomCheckerScreen() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleSymptom = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
    }
  };

  const handleCheckSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert("Error", "Please select at least one symptom");
      return;
    }

    setLoading(true);

    // TODO: Connect to AI API (OpenAI/Gemini)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    setShowResults(true);
  };

  if (showResults) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800 ml-4">
              Analysis Results
            </Text>
          </View>

          {/* Results */}
          <View className="px-6 py-6">
            <View className="bg-blue-50 p-4 rounded-2xl items-center mb-6">
              <Ionicons
                name="information-circle"
                size={48}
                color={Colors.primary}
              />
              <Text className="text-lg font-bold text-gray-800 mt-4 text-center">
                Preliminary Analysis
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Based on your symptoms, here's what we found
              </Text>
            </View>

            {/* Possible Conditions */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Possible Conditions
              </Text>

              <View className="bg-orange-50 p-4 rounded-2xl mb-3">
                <Text className="text-base font-bold text-gray-800 mb-2">
                  ⚠️ Common Cold or Flu
                </Text>
                <Text className="text-gray-700 leading-6">
                  Your symptoms suggest a viral infection. Rest, stay hydrated,
                  and monitor your condition.
                </Text>
              </View>

              <View className="bg-yellow-50 p-4 rounded-2xl">
                <Text className="text-base font-bold text-gray-800 mb-2">
                  💡 General Fatigue
                </Text>
                <Text className="text-gray-700 leading-6">
                  Symptoms may also indicate general fatigue or stress. Ensure
                  adequate sleep.
                </Text>
              </View>
            </View>

            {/* Recommendations */}
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Recommendations
              </Text>
              <View className="bg-green-50 p-4 rounded-2xl">
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text className="flex-1 text-gray-700 ml-3">
                    Get plenty of rest and stay hydrated
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text className="flex-1 text-gray-700 ml-3">
                    Monitor your temperature regularly
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.success}
                  />
                  <Text className="flex-1 text-gray-700 ml-3">
                    Consult a doctor if symptoms worsen
                  </Text>
                </View>
              </View>
            </View>

            {/* Warning */}
            <View className="bg-red-50 p-4 rounded-2xl mb-6">
              <View className="flex-row items-start">
                <Ionicons name="warning" size={20} color={Colors.error} />
                <Text className="flex-1 text-red-700 ml-3 text-sm leading-6">
                  This is not a medical diagnosis. Please consult a qualified
                  doctor for proper evaluation and treatment.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="px-6 py-4 border-t border-gray-200">
          <Button
            title="Consult Doctor Now"
            onPress={() => router.push("./(tabs)")}
            className="mb-3"
          />
          <Button
            title="Check Again"
            onPress={() => {
              setShowResults(false);
              setSelectedSymptoms([]);
              setAdditionalInfo("");
            }}
            variant="outline"
          />
        </View>
      </SafeAreaView>
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
            AI Symptom Checker
          </Text>
        </View>

        {/* Info Banner */}
        <View className="px-6 py-6">
          <View className="bg-blue-50 p-4 rounded-2xl flex-row items-start">
            <Ionicons
              name="information-circle"
              size={24}
              color={Colors.primary}
            />
            <View className="flex-1 ml-3">
              <Text className="text-gray-800 font-semibold mb-1">
                Quick Health Assessment
              </Text>
              <Text className="text-gray-600 text-sm">
                Select your symptoms and get AI-powered preliminary guidance
                before consulting a doctor.
              </Text>
            </View>
          </View>
        </View>

        {/* Select Symptoms */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Select Your Symptoms
          </Text>
          <View className="flex-row flex-wrap">
            {commonSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id);
              return (
                <TouchableOpacity
                  key={symptom.id}
                  className={`mr-3 mb-3 px-4 py-3 rounded-xl border-2 flex-row items-center ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onPress={() => toggleSymptom(symptom.id)}
                >
                  <Ionicons
                    name={symptom.icon as any}
                    size={20}
                    color={isSelected ? Colors.primary : Colors.textSecondary}
                  />
                  <Text
                    className={`ml-2 font-medium ${
                      isSelected ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Additional Information */}
        <View className="px-6 mb-6">
          <Input
            label="Additional Information (Optional)"
            placeholder="Describe any other symptoms or concerns..."
            multiline
            numberOfLines={4}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
          />
        </View>

        {/* Selected Count */}
        {selectedSymptoms.length > 0 && (
          <View className="px-6 mb-6">
            <View className="bg-green-50 p-3 rounded-xl flex-row items-center">
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
              <Text className="text-green-700 ml-2 font-semibold">
                {selectedSymptoms.length} symptom
                {selectedSymptoms.length !== 1 ? "s" : ""} selected
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Check Button */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Button
          title="Analyze Symptoms"
          onPress={handleCheckSymptoms}
          loading={loading}
          disabled={selectedSymptoms.length === 0}
        />
      </View>
    </SafeAreaView>
  );
}
