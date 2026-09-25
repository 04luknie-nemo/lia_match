import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function WorkplaceDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Stack.Screen options={{ title: `Workplace ${id}` }} />
    </View>
  );
}
