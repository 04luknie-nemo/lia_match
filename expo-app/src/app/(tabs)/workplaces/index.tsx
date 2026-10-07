import { getProfile, Profile } from "@/api/profile";
import { getWorkplaces } from "@/api/workplace";
import NoneMatched from "@/app/none-Matched";
import { Workplace } from "@/types/workplace";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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

  function normalise(t: string) {
    return t.toLowerCase().trim();
  }

  // Ifall du läser detta david, ja useQuery hade varit mer konsekvent gentemot appen
  // och mindre kod plus att useQuery med invalidate... hämtar bara om något ändras
  // jämfört med useFocusEffect som hämtar när denna sidan är i fokus
  // MEN jag hittade useFocusEffect och ville prova nåt nytt och vidga min kunskap :D.

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchProfile = async () => {
        try {
          const [fetchedProfile, fetchedWorkplaces] = await Promise.all([
            getProfile().catch(console.error),
            getWorkplaces().catch(console.error),
          ]).finally(() => setIsLoading(false));

          if (isActive) {
            setProfile(fetchedProfile ?? undefined);
            setWorkplaces(fetchedWorkplaces ?? []);
          }
        } catch (e) {
          console.error(e);
        }
      };

      fetchProfile();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const score = (w: Workplace, p: Profile) => {
    const mine = new Set((p.technologies ?? []).map((t) => normalise(t.name)));
    const shared = (w.technologies ?? []).filter((t) =>
      mine.has(normalise(t.name)),
    ).length;
    return shared + (normalise(w.city) === normalise(p.city) ? 1 : 0);
  };

  const matched = profile
    ? workplaces
        .map((w) => ({ ...w, score: score(w, profile) }))
        .filter((w) => w.score > 0)
        .sort((a, b) => b.score - a.score)
    : [];

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : !profile ? (
        <Text>Ingen profil finns!</Text>
      ) : matched.length > 0 ? (
        <View style={styles.listWrapper}>
          <Text style={styles.header}>Dina matchande företag</Text>
          <FlatList
            style={styles.list}
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
        </View>
      ) : (
        <NoneMatched />
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
  listWrapper: {
    flex: 1,
    width: "100%",
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
    width: "100%",
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 12,
  },
});
