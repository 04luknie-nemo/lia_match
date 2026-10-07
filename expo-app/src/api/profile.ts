import * as SecureStore from "@/storage";
import { API_URL } from "./config";

interface ProfileInput {
  city: string;
  technologies: string[];
}

interface ProfileResponse {
  id: number;
}
export interface Profile {
  id: number;
  city: string;
  technologies: { id: number; name: string }[];
}
export interface Appoint {
  id: number;
  shownId: string;
  bussinessName: string;
  city: string;
  deadline: Date;
}

export async function createProfile(profile: ProfileInput) {
  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error("Kunde inte skapa profil");

  const data = (await response.json()) as ProfileResponse;
  await SecureStore.setItemAsync("profileId", data.id.toString());
  return data;
}

export async function getProfile() {
  const id = await SecureStore.getItemAsync("profileId");
  if (!id) return;
  const p = await fetch(`${API_URL}/profile/${id}`);
  if (p.status === 404) {
    await SecureStore.deleteItemAsync("profileId");
    return;
  }
  if (!p.ok) throw new Error("Kunde inte hämta profil");

  const profileRes: Profile = await p.json();
  return profileRes;
}

export async function getAppoints(profileId: string) {
  if (!profileId) return;

  const response = await fetch(`${API_URL}/profile/${profileId}/appoint`);
  if (!response.ok)
    throw new Error("Kunde inte hämta ansökningar till den profilen");

  const profileWithAppoints: Appoint[] = await response.json();
  return profileWithAppoints;
}

export async function SetDeadline(
  profileId: string,
  shownId: string,
  deadline: Date,
) {
  const profileAppoints = await fetch(
    `${API_URL}/profile/${profileId}/appoint/${shownId}/deadline`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Deadline: deadline.toISOString() }),
    },
  );
  if (!profileAppoints.ok)
    throw new Error("Något gick fel vid sättandet av deadline");
}

export async function updateProfile(profileId: string, input: ProfileInput) {
  const response = await fetch(`${API_URL}/profile/${profileId}`);

  if (!response.ok)
    throw new Error(`Kunde inte hämta profil (${response.status})`);

  const update = await fetch(`${API_URL}/profile/${profileId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city: input.city,
      technologies: input.technologies,
    }),
  });
  if (!update.ok) {
    throw new Error(
      `Kunde inte uppdatera profilen med de nya värdena (${update.status})`,
    );
  }
  return update;
}
