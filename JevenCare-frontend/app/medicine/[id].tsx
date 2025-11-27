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
import { medicineService } from "@/services/medicineService";
import { Colors } from "@/constants/Colors";

export default function MedicineDetailScreen() {
  const { id } = useLocalSearchParams();
  const [medicine, setMedicine] = useState<any>(null);
  const [pharmacy, setPharmacy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  const fetchMedicine = async () => {
    setLoading(true);
    const result = await medicineService.getMedicineById(id as string);
    if (result.success) {
      setMedicine(result.data);
      // pharmacyId is populated in the response
      if (result.data.pharmacyId) {
        setPharmacy(result.data.pharmacyId);
      }
    }
    setLoading(false);
  };

  const handleCallPharmacy = () => {
    if (pharmacy?.phone) {
      Linking.openURL(`tel:${pharmacy.phone}`);
    } else {
      Alert.alert("Error", "Phone number not available");
    }
  };

  const handleOrderNow = () => {
    Alert.alert(
      "Order Medicine",
      "Order functionality will be implemented soon"
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!medicine) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Medicine not found</Text>
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
            Medicine Details
          </Text>
        </View>

        {/* Medicine Icon */}
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-blue-50 rounded-full items-center justify-center mb-4">
            <Ionicons name="medkit" size={48} color={Colors.primary} />
          </View>
          <Text className="text-2xl font-bold text-gray-800 text-center px-6">
            {medicine.name}
          </Text>
          <Text className="text-gray-600 mt-2">{medicine.genericName}</Text>
        </View>

        {/* Stock Status */}
        <View className="px-6 mb-6">
          <View
            className={`p-4 rounded-2xl ${medicine.stock > 0 ? "bg-green-50" : "bg-red-50"}`}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    medicine.stock > 0 ? "checkmark-circle" : "close-circle"
                  }
                  size={24}
                  color={medicine.stock > 0 ? Colors.success : Colors.error}
                />
                <Text
                  className={`ml-3 font-bold text-lg ${
                    medicine.stock > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
                </Text>
              </View>
              {medicine.stock > 0 && (
                <Text className="text-green-600 font-semibold">
                  {medicine.stock} units
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Medicine Info */}
        <View className="px-6">
          <View className="bg-gray-50 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
              <Ionicons name="cash" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Price</Text>
                <Text className="text-2xl font-bold text-gray-800">
                  ₹{medicine.price}
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200 my-2" />

            <View className="flex-row items-center mb-4">
              <Ionicons name="business" size={20} color={Colors.primary} />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Manufacturer</Text>
                <Text className="text-gray-800 font-semibold">
                  {medicine.manufacturer}
                </Text>
              </View>
            </View>

            <View className="h-px bg-gray-200 my-2" />

            <View className="flex-row items-center">
              <Ionicons
                name="information-circle"
                size={20}
                color={Colors.primary}
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-600 text-sm">Description</Text>
                <Text className="text-gray-800">{medicine.description}</Text>
              </View>
            </View>
          </View>

          {/* Available At */}
          {pharmacy && (
            <View className="mt-6">
              <Text className="text-lg font-bold text-gray-800 mb-3">
                Available At
              </Text>
              <View className="bg-blue-50 p-4 rounded-2xl">
                <Text className="text-lg font-bold text-gray-800">
                  {pharmacy.pharmacyName || pharmacy.name || "Pharmacy"}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons
                    name="location"
                    size={16}
                    color={Colors.textSecondary}
                  />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {pharmacy.address || "Address not available"}
                  </Text>
                </View>
                {pharmacy.phone && (
                  <TouchableOpacity
                    className="flex-row items-center mt-3"
                    onPress={handleCallPharmacy}
                  >
                    <Ionicons name="call" size={16} color={Colors.primary} />
                    <Text className="text-blue-600 ml-2 font-semibold">
                      {pharmacy.phone}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {medicine.stock > 0 && (
        <View className="px-6 py-4 border-t border-gray-200">
          <Button
            title={`Order Now - ₹${medicine.price}`}
            onPress={handleOrderNow}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
