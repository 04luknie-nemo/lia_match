import { useTheme } from "@/theme/ThemeContext";
import { ThemeName, themes } from "@/theme/themes";
import Feather from "@expo/vector-icons/Feather";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export default function ThemePicker() {
  const { theme, themeName, setThemeName } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(name: ThemeName) {
    setThemeName(name);
    setIsOpen(false);
  }

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setIsOpen(true)}>
        <Text style={styles.emoji}>{theme.emoji}</Text>
        <Feather name="chevron-down" size={18} color={theme.headerText} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        {/* Tryck utanför menyn för att stänga den */}
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>Välj tema</Text>
            {(Object.keys(themes) as ThemeName[]).map((name) => (
              <Pressable
                key={name}
                style={[
                  styles.option,
                  name === themeName && styles.optionSelected,
                ]}
                onPress={() => handleSelect(name)}
              >
                <Text style={styles.optionText}>
                  {themes[name].emoji} {themes[name].label}
                </Text>
                {name === themeName && <Feather name="check" size={18} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    gap: 2,
  },
  emoji: {
    fontSize: 22,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingTop: 100,
    paddingLeft: 16,
  },
  menu: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    gap: 4,
  },
  menuTitle: {
    fontWeight: "600",
    padding: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
  },
  optionSelected: {
    backgroundColor: "#eee",
  },
  optionText: {
    fontSize: 16,
  },
});
