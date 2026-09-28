import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Profile } from "../types/profile";
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
    queryFn: () => getProfile(profileId!),
    enabled: !!profileId,
  });

  async function getProfile(id: string): Promise<Profile> {
    const response = await fetch(
      `http://10.25.9.250:5073/api/profile/${profileId}`,
    );
    if (!response.ok) throw new Error("Kunde inte hämta profil");
    const data = await response.json();
    return data;
  }
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
