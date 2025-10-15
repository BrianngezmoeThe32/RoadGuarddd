import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Text, View } from "react-native";

export default function AdminLayout() {
  const { user, userData, isLoading } = useAuth();

  // Define the expected shape for userData if not already typed
  type AdminUserData = {
    role?: string;
    // add other properties as needed
  };

  const typedUserData = userData as AdminUserData;

  // Show loading state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Redirect non-admin users to main app
  if (!user || typedUserData?.role !== 'admin') {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: "Admin Login"
        }} 
      />
      <Stack.Screen 
        name="dashboard" 
        options={{ 
          headerShown: false,
          title: "Admin Dashboard"
        }} 
      />
      <Stack.Screen 
        name="users" 
        options={{ 
          headerShown: true,
          title: "User Management"
        }} 
      />
      <Stack.Screen 
        name="providers" 
        options={{ 
          headerShown: true,
          title: "Provider Management"
        }} 
      />
      <Stack.Screen 
        name="services" 
        options={{ 
          headerShown: true,
          title: "Service Management"
        }} 
      />
      <Stack.Screen 
        name="analytics" 
        options={{ 
          headerShown: true,
          title: "Analytics"
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          headerShown: true,
          title: "Admin Settings"
        }} 
      />
    </Stack>
  );
}