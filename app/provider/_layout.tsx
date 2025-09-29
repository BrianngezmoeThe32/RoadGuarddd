import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function ProviderLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2D5D3F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="register" />
        <Stack.Screen name="jobs" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="documents" />
      </Stack>
    </>
  );
}