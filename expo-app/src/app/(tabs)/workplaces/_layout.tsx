import { Stack } from "expo-router";

export default function WorkplaceLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Workplaces",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: "Details",
        }}
      />
    </Stack>
  );
}
