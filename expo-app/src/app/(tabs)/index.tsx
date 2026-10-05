import { getWorkplaces } from "@/api/workplace";
import { Workplace } from "@/types/workplace";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
export default function HomeScreen() {
  const [workplaces, setWorkPlaces] = useState<Workplace[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWorkplaces()
      .then((workplaces) => setWorkPlaces(workplaces ?? undefined))
      .finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alla företag</Text>
      <FlatList
        style={styles.list}
        data={workplaces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workplaceCard}>
            <Text style={styles.cardTitle}>{item.bussinessName}</Text>
            <Text>{item.city}</Text>
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
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 12,
  },
  list: {
    width: "100%",
  },
  workplaceCard: {
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
