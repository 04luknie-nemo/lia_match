import { useTheme } from "@/theme/ThemeContext";
import { Stack } from "expo-router";

export default function WorkplaceLayout() {
  const { theme } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.header },
        headerTintColor: theme.headerText,
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Workplaces",
        }}
      />
      <Stack.Screen
        name="[shownId]"
        options={{
          title: "Details",
        }}
      />
    </Stack>
  );
}
