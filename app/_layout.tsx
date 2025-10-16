import { ReactNode, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from "../hooks/useAuth";
import { LocationProvider } from "../context/LocationContext";
import { Stack } from "expo-router";

interface Props {
  children: ReactNode;
}

function InnerLayout({ children }: Props) {
  const { isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1000); // 1s splash
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({ children }: Props) {
  return (
    <AuthProvider>
      <LocationProvider>
        <InnerLayout>
          <Stack
            screenOptions={{
              headerShown: false, // hide all default headers
              animation: "slide_from_right", // optional nice animation
            }}
          >
            {children}
          </Stack>
        </InnerLayout>
      </LocationProvider>
    </AuthProvider>
  );
}
