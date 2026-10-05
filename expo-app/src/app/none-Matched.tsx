import { StyleSheet, Text, View } from "react-native";

export default function NoneMatched() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Inga företag matchar din profil!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});
