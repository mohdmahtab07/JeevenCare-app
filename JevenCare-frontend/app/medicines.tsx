import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import MedicineCard from "@/components/cards/MedicineCard";
import PharmacyCard from "@/components/cards/PharmacyCard";
import { mockMedicines, mockPharmacies } from "@/constants/mockData";
import { Colors } from "@/constants/Colors";

export default function MedicinesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"medicines" | "pharmacies">(
    "medicines"
  );

  const filteredMedicines = mockMedicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPharmacies = mockPharmacies.filter((pharmacy) =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-800 ml-4">
            Find Medicines
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-gray-100 rounded-2xl flex-row items-center px-4 py-3">
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            className="flex-1 ml-3 text-base"
            placeholder="Search medicines or pharmacies..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="bg-white px-6 py-4 flex-row">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl mr-2 ${
            activeTab === "medicines" ? "bg-blue-600" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("medicines")}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "medicines" ? "text-white" : "text-gray-600"
            }`}
          >
            Medicines ({mockMedicines.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-3 rounded-xl ml-2 ${
            activeTab === "pharmacies" ? "bg-blue-600" : "bg-gray-100"
          }`}
          onPress={() => setActiveTab("pharmacies")}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === "pharmacies" ? "text-white" : "text-gray-600"
            }`}
          >
            Pharmacies ({mockPharmacies.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "medicines" ? (
          <>
            {filteredMedicines.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons
                  name="search"
                  size={64}
                  color={Colors.textSecondary}
                />
                <Text className="text-gray-500 mt-4 text-center">
                  No medicines found
                </Text>
                <Text className="text-gray-400 text-sm mt-2 text-center">
                  Try searching with a different name
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-sm text-gray-500 mb-4">
                  {filteredMedicines.length} medicine
                  {filteredMedicines.length !== 1 ? "s" : ""} found
                </Text>
                {filteredMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onPress={() => router.push(`./medicine/${medicine.id}`)}
                  />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {filteredPharmacies.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Ionicons
                  name="storefront-outline"
                  size={64}
                  color={Colors.textSecondary}
                />
                <Text className="text-gray-500 mt-4 text-center">
                  No pharmacies found
                </Text>
              </View>
            ) : (
              <>
                <Text className="text-sm text-gray-500 mb-4">
                  {filteredPharmacies.length}{" "}
                  {filteredPharmacies.length !== 1 ? "pharmacies" : "pharmacy"}{" "}
                  nearby
                </Text>
                {filteredPharmacies.map((pharmacy) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    onPress={() => router.push(`./pharmacy/${pharmacy.id}`)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
