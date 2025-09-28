// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { AuthProvider } from '../hooks/useAuth'; // make sure the path is correct

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#2D5D3F" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="services" />
        <Stack.Screen name="history" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}
