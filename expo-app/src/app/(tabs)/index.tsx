import { getWorkplaces } from "@/api/workplace";
import { Workplace } from "@/types/workplace";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
export default function HomeScreen() {
  const [workplaces, setWorkPlaces] = useState<Workplace[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getWorkplaces()
      .then((workplaces) => setWorkPlaces(workplaces ?? undefined))
      .finally(() => setIsLoading(false));
  }, []);
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <Text>List of workplaces</Text>
      <FlatList
        style={{ width: "100%" }}
        data={workplaces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.workplaceCard}>
            <Text>{item.bussinessName}</Text>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  workplaceCard: {
    borderWidth: 1,
    borderColor: "black",
    padding: 8,
    marginBottom: 8,
  },
});
