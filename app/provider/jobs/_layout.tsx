import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function JobsLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2D5D3F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="history" />
        <Stack.Screen name="[id]" />
      </Stack>
    </>
  );
}