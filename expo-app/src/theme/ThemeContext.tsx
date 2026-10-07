import * as SecureStore from "@/storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Theme, ThemeName, themes } from "./themes";

type ThemeContextValue = {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>("standard");

  // Hämtar det sparade temat när appen startar
  useEffect(() => {
    SecureStore.getItemAsync("theme").then((value) => {
      if (value && value in themes) setThemeNameState(value as ThemeName);
    });
  }, []);

  function setThemeName(name: ThemeName) {
    setThemeNameState(name);
    SecureStore.setItemAsync("theme", name);
  }

  return (
    <ThemeContext.Provider
      value={{ theme: themes[themeName], themeName, setThemeName }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme måste användas inom ThemeProvider");
  return context;
}
