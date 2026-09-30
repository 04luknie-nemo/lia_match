import { createProfile } from "@/api/profile";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function ProfileForm({
  onCreated,
}: {
  onCreated: (id: number) => void;
}) {
  const [city, setCity] = useState("");
  const [techs, setTechs] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (!city.trim() || !techs.trim()) return;

    setIsSaving(true);
    try {
      const technologies = techs.split(",").map((t) => t.trim());
      const result = await createProfile({ city, technologies });
      onCreated(result.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View>
      <Text>Ort</Text>
      <TextInput
        style={styles.input}
        placeholder="Skriv ort här"
        value={city}
        onChangeText={setCity}
      />
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
          {isSaving ? "Sparar..." : "Skapa profil"}
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
