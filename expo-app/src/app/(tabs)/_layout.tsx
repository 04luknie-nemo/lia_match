import ThemePicker from "@/components/ThemePicker";
import { useTheme } from "@/theme/ThemeContext";
import Feather from "@expo/vector-icons/Feather";
import { router, Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabsLayout() {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.header },
        headerTintColor: theme.headerText,
        tabBarStyle: { backgroundColor: theme.tabBar },
        tabBarActiveTintColor: theme.tabActive,
        tabBarInactiveTintColor: theme.tabInactive,
        sceneStyle: { backgroundColor: theme.background },
        headerRight: () => (
          <Pressable
            onPress={() => router.push("/profile-page")}
            style={{ marginRight: 16 }}
          >
            <Feather name="user" size={24} color={theme.headerText} />
          </Pressable>
        ),
        headerLeft: () => <ThemePicker />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Companies",
          tabBarIcon: (props) => <Feather name="home" {...props} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ size, color }) => (
            <Feather name="bell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workplaces"
        options={{
          title: "Matched Workplaces",
          headerShown: false,
          tabBarIcon: (props) => <Feather name="activity" {...props} />,
        }}
      />
    </Tabs>
  );
}
