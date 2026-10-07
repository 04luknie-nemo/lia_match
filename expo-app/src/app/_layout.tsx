import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const client = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider>
        <View style={styles.container}>
          <ThemedStack />
        </View>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Egen komponent så att useTheme körs inuti ThemeProvider
function ThemedStack() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.header },
        headerTintColor: theme.headerText,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeader: { height: 60, backgroundColor: "#000" },
});
