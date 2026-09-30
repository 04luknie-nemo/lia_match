import { getProfile, Profile } from "@/api/profile";
import NoneMatched from "@/app/none-Matched";
import { Workplace } from "@/types/workplace";
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

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [profile, setProfile] = useState<Profile>();

  const getWorkplaces = async () => {
    try {
      const respons = await fetch("http://10.25.9.250:5073/api/workplace");
      const data = (await respons.json()) as Workplace[];
      setWorkplaces(data);
    } catch (error) {
      console.error(error);
    }
  };
  const score = (w: Workplace, p: Profile) => {
    const mine = new Set(
      (p.technologies ?? []).map((t) => t.name.toLowerCase()),
    );
    const shared = (w.technologies ?? []).filter((t) =>
      mine.has(t.name.toLowerCase()),
    ).length;
    return shared + (w.city === p.city ? 1 : 0);
  };
  const matched = profile
    ? workplaces
        .map((w) => ({ ...w, score: score(w, profile) }))
        .filter((w) => w.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];
  useEffect(() => {
    Promise.all([
      getProfile().then(setProfile).catch(console.error),
      getWorkplaces(),
    ]).finally(() => setIsLoading(false));
  }, []);
  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <Text>Dina Matchande Företag</Text>
          {matched.length > 0 ? (
            <FlatList
              style={{ width: "100%" }}
              data={matched}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.workplaceCard}
                  onPress={() =>
                    router.push({
                      pathname: "/workplaces/[shownId]",
                      params: { shownId: item.shownId },
                    })
                  }
                >
                  <Text>Poäng: {item.score}</Text>
                  <Text>{item.bussinessName}</Text>
                  <Text>{item.city}</Text>
                </Pressable>
              )}
            />
          ) : (
            <NoneMatched />
          )}
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
