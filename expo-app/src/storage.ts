import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// SecureStore finns inte på webben, där används localStorage istället
const isWeb = Platform.OS === "web";

export async function getItemAsync(key: string): Promise<string | null> {
  if (isWeb) return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

export async function setItemAsync(key: string, value: string): Promise<void> {
  if (isWeb) return localStorage.setItem(key, value);
  return SecureStore.setItemAsync(key, value);
}

export async function deleteItemAsync(key: string): Promise<void> {
  if (isWeb) return localStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}
