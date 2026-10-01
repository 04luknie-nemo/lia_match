import { API_URL } from "./config";
import { Workplace } from "@/types/workplace";

export const getWorkplaces = async () => {
  try {
    const respons = await fetch(`${API_URL}/workplace`);
    const data = (await respons.json()) as Workplace[];
    return data;
  } catch (error) {
    console.error(error);
  }
};

export async function getWorkplaceWithProfile(
  shownId: string,
  profileId: string,
): Promise<Workplace> {
  const response = await fetch(
    `${API_URL}/workplace/${shownId}?profileId=${profileId}`,
  );
  if (!response.ok) throw new Error("Kunde inte hämta!");
  return await response.json();
}
