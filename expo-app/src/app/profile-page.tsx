import { getProfile } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import ProfileForm from "./profileForm";

export default function ProfilePage() {
  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: profile,
    isPending,
    error,
  } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => (await getProfile()) ?? null,
    enabled: !!profileId,
  });

  useEffect(() => {
    SecureStore.getItemAsync("profileId").then((value) => {
      setProfileId(value ?? undefined);
      setIsLoading(false);
    });
  }, []);
  if (error) return <Text>{error.message}</Text>;

  return (
    <View>
      <Stack.Screen options={{ title: "Profil" }} />
      {isLoading ? (
        <ActivityIndicator />
      ) : profileId ? (
        isPending ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Text>Ort: {profile?.city}</Text>
            <Text>
              Tekniker: {profile?.technologies.map((t) => t.name).join(", ")}
            </Text>
          </View>
        )
      ) : (
        <ProfileForm onCreated={(id) => setProfileId(id.toString())} />
      )}
    </View>
  );
}
