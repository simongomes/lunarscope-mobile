import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TabBar, type TabKey } from "./src/components/TabBar";
import { HomeScreen } from "./src/screens/HomeScreen";
import { PlaceholderScreen } from "./src/screens/PlaceholderScreen";
import { colors } from "./src/theme";

const placeholderTitles: Record<Exclude<TabKey, "home">, string> = {
  explore: "Explore",
  calendar: "Calendar",
  skymap: "Sky Map",
  profile: "Profile",
};

export default function App() {
  const [tab, setTab] = useState<TabKey>("home");

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>
        {tab === "home" ? (
          <HomeScreen />
        ) : (
          <PlaceholderScreen title={placeholderTitles[tab]} />
        )}
        <TabBar active={tab} onChange={setTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
