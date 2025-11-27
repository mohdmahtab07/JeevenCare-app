import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="doctor/[id]" />
      <Stack.Screen name="book-appointment" />
      <Stack.Screen name="appointment/[id]" />
      <Stack.Screen name="record/[id]" />
      <Stack.Screen name="medicines" />
      <Stack.Screen name="medicine/[id]" />
      <Stack.Screen name="pharmacy/[id]" />
      <Stack.Screen name="symptom-checker" />
    </Stack>
  );
}
