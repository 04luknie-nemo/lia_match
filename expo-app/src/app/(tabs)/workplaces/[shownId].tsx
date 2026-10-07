import { API_URL } from "@/api/config";
import { getWorkplaceWithProfile } from "@/api/workplace";
import * as SecureStore from "@/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "expo-checkbox";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import {
  Link,
  Stack,
  useLocalSearchParams,
  type ExternalPathString,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

async function setAppointed(
  profileId: string,
  shownId: string,
  appointed: boolean,
) {
  const response = await fetch(
    `${API_URL}/profile/${profileId}/appoint/${shownId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ IsAppointed: appointed }),
    },
  );
  if (!response.ok) throw new Error("Kunde inte uppdatera");
}

export default function WorkplaceDetail() {
  const { shownId } = useLocalSearchParams<{ shownId: string }>();
  const queryClient = useQueryClient();

  const [profileId, setProfileId] = useState<string>();
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopied(text: string) {
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  useEffect(() => {
    SecureStore.getItemAsync("profileId").then((value) =>
      setProfileId(value ?? undefined),
    );
  }, []);
  const mutation = useMutation({
    mutationFn: (appointed: boolean) => {
      if (!profileId) throw new Error("Ingen profil sparad");
      return setAppointed(profileId, shownId, appointed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workplace", shownId] });
      queryClient.invalidateQueries({ queryKey: ["workplaces"] });
    },
  });

  const { data, isPending, error } = useQuery({
    queryKey: ["workplace", shownId],
    queryFn: () => getWorkplaceWithProfile(shownId, profileId!),
    // Väntar på profileId från secure store
    enabled: !!profileId,
  });

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Details",
          headerBackTitle: "Back",
        }}
      />
      <Text style={styles.header}>{data?.bussinessName}</Text>
      <Text style={styles.subtitle}>Ligger i {data?.city}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Ansökan</Text>
        {data?.applicationUrl ? (
          <View style={styles.row}>
            <Link
              style={styles.link}
              href={data.applicationUrl as ExternalPathString}
            >
              Ansök här!
            </Link>
            <Pressable
              style={styles.smallButton}
              onPress={() => handleCopied(data.applicationUrl)}
            >
              <Text style={styles.smallButtonText}>
                {isCopied ? "Kopierad!" : "Kopiera länk"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text>Ingen länk tyvärr</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Hemsida</Text>
        {data?.websiteUrl ? (
          <Link
            style={styles.link}
            href={data.websiteUrl as ExternalPathString}
          >
            Besök hemsidan
          </Link>
        ) : (
          <Text>Ingen hemsida tyvärr</Text>
        )}
      </View>

      <View style={[styles.card, styles.row]}>
        <Text style={styles.label}>Har sökt</Text>
        <Checkbox
          style={styles.checkbox}
          value={data?.isAppointed ?? false}
          onValueChange={(value) => mutation.mutate(value)}
        />
      </View>
      {/* Här får man ha delen med antal tidigare lia studenter */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 8,
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontWeight: "600",
  },
  link: {
    color: "#1a73e8",
    textDecorationLine: "underline",
  },
  smallButton: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  smallButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  checkbox: {
    width: 24,
    height: 24,
  },
});
