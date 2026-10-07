import {
  createProfile,
  getAppoints,
  getProfile,
  SetDeadline,
  updateProfile,
} from "@/api/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SecureStore from "@/storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ProfileForm from "./profileForm";

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const [profileId, setProfileId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedShownId, setSelectedShownId] = useState<string>("");
  const [deadlineText, setDeadlineText] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("09:00");

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSetDeadline() {
    const deadline = new Date(deadlineText);
    // Godkänner t.ex. "9:00" och "09:30"
    const time = reminderTime.match(/^(\d{1,2}):(\d{2})$/);
    if (!selectedShownId || isNaN(deadline.getTime()) || !time) {
      return;
    }
    const hours = Number(time[1]);
    const minutes = Number(time[2]);
    if (hours > 23 || minutes > 59) return;

    mutation.mutate({ shownId: selectedShownId, deadline, hours, minutes });
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
      hours: number;
      minutes: number;
    }) => {
      if (!profileId) throw new Error("Ingen profil sparad");
      return SetDeadline(profileId, shownId, deadline);
    },
    onSuccess: async (_data, { shownId, deadline, hours, minutes }) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      queryClient.invalidateQueries({ queryKey: ["appoints"] });
      setSelectedShownId("");
      setDeadlineText("");

      const remindAt = new Date(deadline);
      remindAt.setDate(remindAt.getDate() - 1);
      remindAt.setHours(hours, minutes, 0, 0);

      await Notifications.cancelScheduledNotificationAsync(shownId);
      if (remindAt > new Date()) {
        await Notifications.scheduleNotificationAsync({
          identifier: shownId,
          content: {
            title: "Deadline imorgon!",
            body: "Glöm inte att skicka in din ansökan :D",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: remindAt,
          },
        });
      }
    },
    onError: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Profil" }} />
      {isLoading ? (
        <ActivityIndicator />
      ) : profileId && (isPending || profile) ? (
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
          <View style={styles.content}>
            <View style={styles.card}>
              <Text>
                <Text style={styles.label}>Ort: </Text>
                {profile?.city}
              </Text>
              <Text>
                <Text style={styles.label}>Tekniker: </Text>
                {profile?.technologies.map((t) => t.name).join(", ")}
              </Text>
              <Pressable style={styles.button} onPress={handleEdit}>
                <Text style={styles.buttonText}>Redigera profil</Text>
              </Pressable>
            </View>
            {selectedShownId ? (
              <View style={styles.card}>
                <Text style={styles.label}>Sätt deadline</Text>
                <TextInput
                  style={styles.input}
                  value={deadlineText}
                  onChangeText={setDeadlineText}
                  placeholder="ÅÅÅÅ-MM-DD"
                />
                <Text style={styles.label}>Påminnelse dagen innan kl.</Text>
                <TextInput
                  style={styles.input}
                  value={reminderTime}
                  onChangeText={setReminderTime}
                  placeholder="TT:MM"
                />
                <Pressable
                  style={styles.button}
                  onPress={handleSetDeadline}
                  disabled={mutation.isPending}
                >
                  <Text style={styles.buttonText}>
                    {mutation.isPending ? "Sparar..." : "Spara deadline"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => setSelectedShownId("")}
                >
                  <Text style={styles.secondaryButtonText}>Avbryt</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.listWrapper}>
                <Text style={styles.header}>Ansökningar valda</Text>
                <Text style={styles.hint}>
                  Tryck på ett företag för att sätta deadline
                </Text>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.listCard}
                      onPress={() => setSelectedShownId(item.shownId)}
                    >
                      <Text style={styles.label}>{item.bussinessName}</Text>
                      <Text>{item.city}</Text>
                      <Text>
                        {item.deadline
                          ? new Date(item.deadline!).toLocaleDateString("sv-SE")
                          : "Ingen deadline satt!"}
                      </Text>
                    </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  listWrapper: {
    flex: 1,
  },
  listCard: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
  },
  hint: {
    alignSelf: "center",
    color: "#555",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { fontWeight: "600" },
});
