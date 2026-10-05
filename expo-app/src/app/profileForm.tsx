import { Profile } from "@/api/profile";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ProfileForm({
  initialProfile,
  onSubmit,
  submitLabel = "Skapa profil",
}: {
  initialProfile?: Profile;
  onSubmit: (input: { city: string; technologies: string[] }) => Promise<void>;
  submitLabel?: string;
}) {
  const [city, setCity] = useState(initialProfile?.city ?? "");
  const [techs, setTechs] = useState(
    initialProfile?.technologies.map((t) => t.name).join(", ") ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (!city.trim() || !techs.trim()) return;
    setIsSaving(true);
    try {
      const technologies = techs.split(",").map((t) => t.trim());
      await onSubmit({ city, technologies });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ort</Text>
      <TextInput
        style={styles.input}
        placeholder="Skriv ort här"
        value={city}
        onChangeText={setCity}
      />
      <Text style={styles.label}>Tekniker</Text>
      <TextInput
        style={styles.input}
        placeholder="Tekniker, separera med ','"
        value={techs}
        onChangeText={setTechs}
      />
      <Pressable
        style={styles.button}
        onPress={handleSubmit}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>
          {isSaving ? "Sparar..." : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  label: { fontWeight: "600" },
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
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
