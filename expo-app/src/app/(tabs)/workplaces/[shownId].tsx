import { Workplace } from "@/types/workplace";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

async function getWorkplace(shownId: string): Promise<Workplace> {
  const response = await fetch(
    "http://10.25.9.250:5073/api/workplace/" + shownId,
  );
  if (!response.ok) throw new Error("Kunde inte hämta!");
  return response.json();
}
export default function WorkplaceDetail() {
  const { shownId } = useLocalSearchParams<{ shownId: string }>();
  const { data, isPending, error } = useQuery({
    queryKey: ["workplace", shownId],
    queryFn: () => getWorkplace(shownId),
  });

  if (isPending) return <Text>Laddar...</Text>;
  if (error) return <Text>{error.message}</Text>;

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Details",
          headerBackTitle: "Back",
        }}
      />
      <Text>Företag: {data?.bussinessName}</Text>
      <Text>Ligger i {data?.city}</Text>
    </View>
  );
}
