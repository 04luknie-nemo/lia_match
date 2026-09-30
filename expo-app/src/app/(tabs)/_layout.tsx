import Feather from "@expo/vector-icons/Feather";
import { router, Tabs } from "expo-router";
import { Pressable } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={() => router.push("/profile-page")}>
            <Feather name="user" size={24} />
          </Pressable>
        ),
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
