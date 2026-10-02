import { API_URL } from "@/api/config";
import { getWorkplaceWithProfile } from "@/api/workplace";
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
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

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

  if (isPending) return <Text>Laddar...</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Details",
          headerBackTitle: "Back",
        }}
      />
      <Text>Företag: {data?.bussinessName}</Text>
      <Text>Ligger i {data?.city}</Text>
      <View>
        {data?.applicationUrl ? (
          <View>
            <Link href={data?.applicationUrl as ExternalPathString}>
              Ansök här!
            </Link>
            <Pressable onPress={() => handleCopied(data.applicationUrl)}>
              <Text>{isCopied ? "Kopierad!" : "Kopiera Länk!"}</Text>
            </Pressable>
          </View>
        ) : (
          "Ingen länk tyvärr"
        )}
      </View>
      <Text>
        {data?.websiteUrl ? (
          <Link href={data?.websiteUrl as ExternalPathString}>Website här</Link>
        ) : (
          "Ingen hemsida tyvärr"
        )}
      </Text>
      <Checkbox
        value={data?.isAppointed ?? false}
        onValueChange={(value) => mutation.mutate(value)}
      />
      {/* Här får man ha delen med antal tidigare lia studenter */}
    </View>
  );
}
