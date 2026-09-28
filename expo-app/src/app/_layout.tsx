import Feather from "@expo/vector-icons/Feather";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

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
              headerShown: true,
              headerRight: () => (
                <Pressable onPress={() => router.push("/profile")}>
                  <Feather name="user" size={24} />
                </Pressable>
              ),
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
