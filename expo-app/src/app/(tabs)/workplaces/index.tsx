import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Workplace {
  id: number;
  bussinessName: string;
  city: string;
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  const getWorkplaces = async () => {
    try {
      const respons = await fetch("http://10.25.9.250:5073/api/workplace");
      const data = (await respons.json()) as Workplace[];
      setWorkplaces(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getWorkplaces();
  }, []);
  console.log(workplaces);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Text>Index</Text>
          <FlatList
            style={{ width: "100%" }}
            data={workplaces}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.workplaceCard}
                onPress={() =>
                  router.push({
                    pathname: "/workplaces/[id]",
                    params: { id: item.id },
                  })
                }
              >
                <Text>{item.bussinessName}</Text>
                <Text>{item.city}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
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
