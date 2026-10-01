import { getAppoints, getProfile, SetDeadline } from "@/api/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ProfileForm from "./profileForm";

export default function ProfilePage() {
  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: profile,
    isPending,
    error,
  } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => (await getProfile()) ?? null,
    enabled: !!profileId,
  });

  const mutation = useMutation({
    mutationFn: ({
      shownId,
      deadline,
    }: {
      shownId: string;
      deadline: Date;
    }) => {
      if (!profileId) throw new Error("Ingen profil sparad");
      return SetDeadline(profileId, shownId, deadline);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appoints"] });
    },
  });

  useEffect(() => {
    SecureStore.getItemAsync("profileId").then((value) => {
      setProfileId(value ?? undefined);
      setIsLoading(false);
    });
  }, []);
  const { data } = useQuery({
    queryKey: ["appoints", profileId],
    queryFn: () => getAppoints(profileId!),
    enabled: !!profileId,
  });
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
            <View>
              <Text>Ansökningar valda:</Text>
              <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View>
                    <Text>{item.bussinessName}</Text>
                    <Text>{item.city}</Text>
                    <Text>{item.deadline ?? "Ingen deadline satt!"}</Text>
                  </View>
                )}
              />
            </View>
          </View>
        )
      ) : (
        <ProfileForm onCreated={(id) => setProfileId(id.toString())} />
      )}
    </View>
  );
}
