import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts } from "../theme";

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.primary.bold,
    fontSize: 24,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: fonts.secondary.regular,
    fontSize: 15,
    marginTop: 8,
  },
});
