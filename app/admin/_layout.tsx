import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function AdminLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="users" />
        <Stack.Screen name="providers" />
        <Stack.Screen name="services" />
        <Stack.Screen name="analytics" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}