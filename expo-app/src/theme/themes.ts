export type ThemeName = "standard" | "halloween" | "jul" | "midsommar";

export type Theme = {
  label: string;
  emoji: string;
  background: string;
  header: string;
  headerText: string;
  tabBar: string;
  tabActive: string;
  tabInactive: string;
};

export const themes: Record<ThemeName, Theme> = {
  standard: {
    label: "Standard",
    emoji: "🎨",
    background: "#f2f2f2",
    header: "#ffffff",
    headerText: "#000000",
    tabBar: "#ffffff",
    tabActive: "#007aff",
    tabInactive: "#8e8e93",
  },
  halloween: {
    label: "Halloween",
    emoji: "🎃",
    background: "#fff3e6",
    header: "#ff7518",
    headerText: "#000000",
    tabBar: "#1a1a1a",
    tabActive: "#ff7518",
    tabInactive: "#aaaaaa",
  },
  jul: {
    label: "Jul",
    emoji: "🎄",
    background: "#fdf6f0",
    header: "#b3001b",
    headerText: "#ffffff",
    tabBar: "#0b6623",
    tabActive: "#ffffff",
    tabInactive: "#a5d6a7",
  },
  midsommar: {
    label: "Midsommar",
    emoji: "🌼",
    background: "#f3fbe9",
    header: "#006aa7",
    headerText: "#fecc00",
    tabBar: "#006aa7",
    tabActive: "#fecc00",
    tabInactive: "#cfe3f0",
  },
};
