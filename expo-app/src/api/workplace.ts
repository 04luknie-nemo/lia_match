import { Workplace } from "@/types/workplace";

export const getWorkplaces = async () => {
  try {
    const respons = await fetch("http://10.25.9.250:5073/api/workplace");
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
    `http://10.25.9.250:5073/api/workplace/${shownId}?profileId=${profileId}`,
  );
  if (!response.ok) throw new Error("Kunde inte hämta!");
  return await response.json();
}
