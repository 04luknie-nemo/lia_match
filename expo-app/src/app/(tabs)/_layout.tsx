import Feather from "@expo/vector-icons/Feather";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
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
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props) => <Feather name="settings" {...props} />,
        }}
      />
      <Tabs.Screen
        name="workplaces"
        options={{
          title: "Workplaces",
          headerShown: false,
          tabBarIcon: (props) => <Feather name="activity" {...props} />,
        }}
      />
    </Tabs>
  );
}
