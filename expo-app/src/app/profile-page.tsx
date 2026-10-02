import {
  createProfile,
  getAppoints,
  getProfile,
  SetDeadline,
  updateProfile,
} from "@/api/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import ProfileForm from "./profileForm";

export default function ProfilePage() {
  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const [selectedShownId, setSelectedShownId] = useState<string>("");
  const [deadlineText, setDeadlineText] = useState<string>("");

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSetDeadline() {
    const deadline = new Date(deadlineText);
    if (!selectedShownId || isNaN(deadline.getTime())) {
      return;
    }
    mutation.mutate({ shownId: selectedShownId, deadline });
  }

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
      setSelectedShownId("");
      setDeadlineText("");
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
        ) : isEditing ? (
          <ProfileForm
            initialProfile={profile!}
            submitLabel="Spara ändringar"
            onSubmit={async (input) => {
              await updateProfile(profileId!, input);
              queryClient.invalidateQueries({ queryKey: ["profile"] });
              setIsEditing(false);
            }}
          />
        ) : (
          <View>
            <Text>Ort: {profile?.city}</Text>
            <Text>
              Tekniker: {profile?.technologies.map((t) => t.name).join(", ")}
            </Text>
            <Pressable onPress={handleEdit}>
              <Text>Edit</Text>
            </Pressable>
            {selectedShownId ? (
              <View>
                <TextInput
                  value={deadlineText}
                  onChangeText={setDeadlineText}
                  placeholder="ÅÅÅÅ-MM-DD"
                />
                <Pressable
                  onPress={handleSetDeadline}
                  disabled={mutation.isPaused}
                >
                  <Text>
                    {mutation.isPending ? "Sparar..." : "Spara Deadline"}
                  </Text>
                </Pressable>
                <Pressable onPress={() => setSelectedShownId("")}>
                  <Text>Avbryt</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text>Ansökningar valda:</Text>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View>
                      <Pressable
                        onPress={() => setSelectedShownId(item.shownId)}
                      >
                        <Text>{item.bussinessName}</Text>
                      </Pressable>
                      <Text>{item.city}</Text>
                      <Text>
                        {item.deadline
                          ? new Date(item.deadline!).toLocaleDateString("sv-SE")
                          : "Ingen deadline satt!"}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}
          </View>
        )
      ) : (
        <ProfileForm
          onSubmit={async (input) => {
            const result = await createProfile(input);
            setProfileId(result.id.toString());
          }}
        />
      )}
    </View>
  );
}
