import { getAppoints } from "@/api/profile";
import { useQuery } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function NotificationScreen() {
  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data, isPending, error } = useQuery({
    queryKey: ["appoints", profileId],
    queryFn: () => getAppoints(profileId!),
    enabled: !!profileId,
  });
  useEffect(() => {
    SecureStore.getItemAsync("profileId").then((value) => {
      setProfileId(value ?? undefined);
      setIsLoading(false);
    });
  }, []);

  if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : profileId ? (
        isPending ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.shownId}
            renderItem={({ item }) => (
              <View>
                <Text>
                  {item.deadline
                    ? new Date(item.deadline).toLocaleDateString("sv-SE")
                    : "Ingen deadline satt"}
                </Text>
                <Text>{item.bussinessName}</Text>
              </View>
            )}
          />
        )
      ) : (
        <View>
          <Text>Ingen profil skapad</Text>
        </View>
      )}
    </View>
  );
}
