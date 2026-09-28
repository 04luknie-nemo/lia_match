import * as SecureStore from "expo-secure-store";

interface ProfileInput {
  city: string;
  technologies: string[];
}

interface ProfileResponse {
  id: number;
}

export async function CreateProfile(profile: ProfileInput) {
  const response = await fetch("http://10.25.9.250:5073/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error("Kunde inte skapa profil");

  const data = (await response.json()) as ProfileResponse;
  await SecureStore.setItemAsync("profileId", data.id.toString());
  return data;
}
