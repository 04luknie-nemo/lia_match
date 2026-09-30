import { Workplace } from "@/types/workplace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Stack,
  useLocalSearchParams,
  type ExternalPathString,
} from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";

async function getWorkplace(
  shownId: string,
  profileId: string,
): Promise<Workplace> {
  const response = await fetch(
    `http://10.25.9.250:5073/api/workplace/${shownId}?profileId=${profileId}`,
  );
  if (!response.ok) throw new Error("Kunde inte hämta!");
  return await response.json();
}
async function setAppointed(
  profileId: string,
  shownId: string,
  appointed: boolean,
) {
  const response = await fetch(
    `http://10.25.9.250:5073/api/profile/${profileId}/appoint/${shownId}`,
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

  const [profileId, setProfileId] = useState<string | undefined>(undefined);

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
    queryFn: () => getWorkplace(shownId, profileId!),
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
      <Text>
        {data?.applicationUrl ? (
          <Link href={data?.applicationUrl as ExternalPathString}>
            Ansök här!
          </Link>
        ) : (
          "Ingen länk tyvärr"
        )}
      </Text>
      <Text>
        {data?.websiteUrl ? (
          <Link href={data?.websiteUrl as ExternalPathString}>Website här</Link>
        ) : (
          "Ingen hemsida tyvärr"
        )}
      </Text>
      <Switch
        value={data?.isAppointed ?? false}
        onValueChange={(value) => mutation.mutate(value)}
      />
      {/* Här får man ha delen med antal tidigare lia studenter */}
    </View>
  );
}
