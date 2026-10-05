import { getAppoints } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function NotificationScreen() {
  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data, isPending, error } = useQuery({
    queryKey: ["appoints", profileId],
    queryFn: () => getAppoints(profileId!),
    enabled: !!profileId,
  });
  useEffect(() => {
    SecureStore.getItemAsync("profileId").then((value) => {
      setProfileId(value ?? undefined);
      setIsLoading(false);
    });
  }, []);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (isLoading || (profileId && isPending)) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!profileId) {
    return (
      <View style={styles.centered}>
        <Text>Ingen profil skapad</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kommande deadlines</Text>
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item) => item.shownId}
        ListEmptyComponent={<Text>Inga deadlines satta än</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.bussinessName}</Text>
            <Text>
              {item.deadline
                ? new Date(item.deadline).toLocaleDateString("sv-SE")
                : "Ingen deadline satt"}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 12,
  },
  list: {
    width: "100%",
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: "600",
  },
});
