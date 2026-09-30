import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

const client = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={client}>
      <View style={styles.container}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "",
              headerShown: false,
            }}
          />
        </Stack>
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeader: { height: 60, backgroundColor: "#000" },
});
